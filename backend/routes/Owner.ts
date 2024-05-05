import express, { Request, Response } from 'express';
import Organization, { IOrganization } from '../models/Organization';
import User from '../models/User';
import Device from '../models/Device';
import verifyRole from '../middleware/verifyRole';
import checkOrgMembership from '../middleware/checkOrg';
import verifySession from '../middleware/verifySession';
import { body, validationResult } from 'express-validator';
import { CustomReq } from '../types/custom';
import { sendEmail } from '../util/emailUtil';
import crypto from 'crypto';

const router = express.Router();


router.post('/invite-admin', verifySession, verifyRole('owner'), async(expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const { email, name} = req.body;

    try {
        const user = await User.findOne({email: email});
        if (user) {
            return res.status(400).json({msg: "User with that email already exists!"});
        }

        const passwordToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        const newUserId = crypto.randomBytes(16).toString('hex');

        const newUser = new User({
            userId: newUserId,
            email: email,
            role: 'admin',
            name: name,
            setPasswordToken: passwordToken,
            passwordTokenExpiry: tokenExpiry
        });

        await newUser.save();

        await sendEmail({
            to: email,
            subject: 'You have been invited as an admin',
            text: `An account has been created for you. Please login using this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}`
        });

        return res.status(200).json({msg: 'User successfully invited'});

    } catch(err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }

});


export default router;
