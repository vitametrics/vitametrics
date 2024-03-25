import express, { Request, Response } from 'express';
import argon2 from 'argon2';
import crypto from 'crypto';
import verifySession from '../middleware/verifySession';
import { CustomReq } from '../util/customReq';
import User from '../models/User';
import Organization from "../models/Organization"
import { sendEmail } from '../util/emailUtil';
import { query, validationResult } from 'express-validator';
const router = express.Router();

// user session authentication status
router.get('/auth/status', async (req: CustomReq, res: Response) => {

    if (req.isAuthenticated && req.isAuthenticated()) {

        let hasFitbitAccountLinked = false;
        let isOrgOwner = false;
        const emailVerified = req.user.emailVerified;

        await Organization.findOne({ orgId: req.user.orgId }).then(found => {
            if (found && found.fitbitAccessToken !== "" && found.ownerId == req.user.userId) {
                hasFitbitAccountLinked = true;
                isOrgOwner = true;
            } else if (found && found.fitbitAccessToken !== "") {
                hasFitbitAccountLinked = true;
            }
        })

        return res.json({
            isAuthenticated: true,
            user: {
                id: req.user.userId,
                email: req.user.email,
                orgId: req.user.orgId,
                isEmailVerified: emailVerified,
                isOrgOwner: isOrgOwner,
                isAccountLinked: hasFitbitAccountLinked
            }
        });
    } else {
        return res.json({ isAuthenticated: false });
    }
});

// invite resend for user
router.post('/resend-invite', async(req: Request, res: Response) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({msg: 'Missing email'});
    }

    try {
        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }

        if (user.lastInviteSent && Number(new Date()) - Number(user.lastInviteSent) < 3 * 3600000) {
            return res.status(429).json({msg: 'Invite already sent within the last 3 hours'});
        }

        const newPasswordToken = crypto.randomBytes(32).toString('hex');
        const newTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        user.setPasswordToken = newPasswordToken;
        user.passwordTokenExpiry = newTokenExpiry;
        user.lastInviteSent = new Date();

        await user.save();

        const setPasswordLink = `https://${process.env.BASE_URL}/set-password?token=${newPasswordToken}`;
    
        await sendEmail({
            to: email,
            subject: 'New Invitation Link',
            text: `You have been invited again! Please set your password by following this link: ${setPasswordLink}\nThis link will expire in 1 hour.`,
        });

        return res.status(200).json({msg: 'Invitation link has been resent'});
    } catch(err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

// user password setting
router.post('/set-password', async (req: Request, res: Response) => {

    const {token, password} = req.body;

    if (!token || !password) {
        return res.status(400).json({msg: 'Missing token or password'});
    }

    try {
        const user = await User.findOne({
            setPasswordToken: token,
            tokenExpiry: {$gte: Date.now()}
        });

        if (!user) {
            return res.status(400).json({msg: 'Invalid or expired token'});
        }

        user.password = await argon2.hash(password);
        user.setPasswordToken = null;
        user.passwordTokenExpiry = null;
        await user.save();

        return res.status(200).json({msg: 'Password has been set successfully'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

// send user verification email
router.post('/send-email-verification', verifySession, async (req: CustomReq, res: Response) => {

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const verificationLink = `https://${process.env.BASE_URL as string}/api/user/verify-email?token=${user.emailVerfToken}`;

    return sendEmail({
        to: user.email,
        subject: 'Physiobit Email Verification',
        text: `Please verify your email using this link ${verificationLink}`
    });
});

// verify user email 
router.get('/verify-email', verifySession, [
    query('token').not().isEmpty().withMessage('No token provided')
], async (req: CustomReq, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ emailVerfToken: req.query.token });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired verification token' });
        }

        if (!req.user || req.user.id !== user._id.toString()) {
            return res.redirect('/dashboard');
        }

        user.emailVerified = true;
        user.emailVerfToken = "";

        await user.save();

        return res.redirect('/dashboard?verified=true');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

export default router;
