import express, { Request, Response } from 'express';
import User from '../models/User';
import verifyRole from '../middleware/verifyRole';
import verifySession from '../middleware/verifySession';
import { validationResult } from 'express-validator';
import { sendEmail } from '../middleware/util/emailUtil';
import crypto from 'crypto';

const router = express.Router();


router.post('/invite-admin', verifySession, verifyRole('owner'), async(req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
