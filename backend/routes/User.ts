import express, { Request, Response } from 'express';
import argon2, { verify } from 'argon2';
import crypto from 'crypto';
import verifySession from '../middleware/verifySession';
import User from '../models/User';
import Project from "../models/Project"
import { sendEmail } from '../util/emailUtil';
import { query, validationResult, body } from 'express-validator';
import { CustomReq } from '../types/custom';
const router = express.Router();

// user session authentication status
router.get('/auth/status', async (expressReq: Request, res: Response) => {

    const req = expressReq as CustomReq;

    if (req.isAuthenticated && req.isAuthenticated()) {

        const userId = req.user.userId;

        try {
            const projects = await Project.find({
                members: {$in: [userId]}
            }).lean();

            const userProjects = projects.map(project => ({
                projectId: project.projectId,
                projectName: project.projectName,
                isOwner: project.ownerId === userId,
                hasFitbitAccountLinked: project.fitbitAccessToken !== ""
            }));

            return res.json({
                isAuthenticated: true,
                user: {
                    id: userId,
                    email: req.user.email,
                    role: req.user.role,
                    isEmailVerified: req.user.emailVerified,
                    projects: userProjects
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Internal Server Error'});
        }
    } else {
        return res.json({ isAuthenticated: false });
    }
});

// invite resend for user
router.post('/resend-invite', async(expressReq: Request, res: Response) => {

    const req = expressReq as CustomReq;

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

router.post('/check-password-token', [
    body('token').not().isEmpty().withMessage('Token is required')
],  async( expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    const req = expressReq as CustomReq;

    const {token} = req.body;

    try {
        const user = await User.findOne({setPasswordToken: token});
        if (!user) {
            return res.status(500).json({msg: 'Invalid token'});
        }

        return res.status(200).json({msg: 'Token is valid'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }

});

// user password setting
router.post('/set-password', [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
    query('projectId').optional().isString().withMessage('Invalid project id')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    const {token, password} = req.body;
    const projectId = req.query.projectId as string;
    
    try {
        const user = await User.findOne({setPasswordToken: token});
        const project = await Project.findOne({ orgId: projectId });

        if (!user) {
            return res.status(400).json({msg: 'Invalid or expired token'});
        }

        if (!project && user.role === 'admin') {
            user.password = await argon2.hash(password);
            user.emailVerified = true;
            user.setPasswordToken = null;
            user.passwordTokenExpiry = null;
            await user.save();
            return res.status(200).json({msg: 'Password has been set successfully', email: user.email});
        } else if (!project){
            return res.status(404).json({msg: 'Project not found'});
        }

        user.password = await argon2.hash(password);
        user.emailVerified = true;
        user.setPasswordToken = null;
        user.passwordTokenExpiry = null;
        user.projects.push(project._id);
        await user.save();

        project.members.push(user._id);
        await project.save();

        return res.status(200).json({msg: 'Password has been set successfully', email: user.email});
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

router.post('/change-password', verifySession, [
    body('password').not().isEmpty().withMessage('Password is required')
], async (expressReq: Request, res: Response) => {


    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    if (!req.user) {
        return res.status(401).json({msg: "Unauthorized"});
    }
    const userId = req.user.userId;
    const {password} = req.body;

    try { 
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.password = await argon2.hash(password);
        await user.save();
        return res.status(200).json({ msg: 'Password changed!' });
} catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal Server Error' });
} 
});

router.post('/change-email', verifySession, [
    body('email').isEmail().withMessage('Invalid email')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const userId = req.user.userId;
    const {email} = req.body;

    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.email = email;
        user.emailVerified = false;
        user.emailVerfToken = crypto.randomBytes(32).toString('hex');
        await user.save();
        
        const project = await Project.findOne({ ownerId: userId});
        if (project) {
            project.ownerEmail = email;
            await project.save();
        }

        return res.status(200).json({ msg: 'Email changed!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }

});

// send user verification email
router.post('/send-email-verification', verifySession, async (expressReq: Request, res: Response) => {

    const req = expressReq as CustomReq;

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
        subject: 'Vitametrics Email Verification',
        text: `Please verify your email using this link ${verificationLink}`
    });
});

// verify user email 
router.get('/verify-email', verifySession, [
    query('token').not().isEmpty().withMessage('No token provided')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    try {
        const user = await User.findOne({ emailVerfToken: req.query.token as string });

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

router.post('/delete-account', verifySession, [
    body('password').not().isEmpty().withMessage('Password is required')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const req = expressReq as CustomReq;
    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const { password }  = req.body;
    const userId = req.user.userId;

    try {

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ msg: 'User not found'});
        }

        const passMatch = await verify(user.password, password);
        if (!passMatch) {
            return res.status(401).json({ msg: 'Incorrect Password'});
        }

        const project = await Project.findOne({ ownerId: userId});
        if (project) {

            return res.status(400).json({ msg: 'Cannot delete account. User is an organization owner' });

        } else {

            await Project.updateOne(
                { members: user._id },
                { $pull: { members: user._id } }
            );

            await User.deleteOne({ userId });
        }
        return res.status(200).json({ msg: 'Account deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

export default router;
