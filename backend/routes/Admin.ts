import express, { Request, Response } from 'express';
import Invite from '../models/Invite';
import crypto from 'crypto';
import Organization from '../models/Organization';
import User from '../models/User';
import { sendEmail } from '../util/emailUtil';
import argon2 from 'argon2';

const router = express.Router();

router.post('/create-org', async (req: Request, res: Response) => {
    const token = req.headers['x-access-token'];
    const { orgName, ownerName, ownerEmail } = req.body;

    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!orgName || !ownerName || !ownerEmail) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
        // const ownerExists = await User.findOne({userId: ownerId})
        // if (!ownerExists) {
        //     return res.status(404).json({ msg: 'Owner not found' });
        // }

        const newUserId = crypto.randomBytes(16).toString('hex');
        const newOrgId = crypto.randomBytes(16).toString('hex');
        const tempPassword = crypto.randomBytes(16).toString('hex');

        const newUser = new User({
            userId: newUserId,
            email: ownerEmail,
            password: await argon2.hash(tempPassword), // randomly generated password to be emailed to user
            languageLocale: 'en-US',
            distanceUnit: 'en-US',
            orgId: newOrgId,
        });

        await newUser.save();

        const newOrganization = new Organization({
            orgName,
            orgId: newOrgId,
            ownerName,
            ownerEmail        
        });

        await newOrganization.save();

        await sendEmail({
            to: ownerEmail,
            subject: 'Your New Organization Account',
            text: `Your account has been created. Your login is: ${ownerEmail}\nYour password is: ${tempPassword}`,
        });

        return res.status(201).json({ msg: 'Organization created successfully', organization: newOrganization });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

router.post('/create-invite', async (req: Request, res: Response) => {

    const token = req.headers['x-access-token'];
    const { emails } = req.body;
    
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!emails || !Array.isArray(emails) || emails.length == 0) {
        return res.status(400).json({ msg: 'Emails required' });
    }

    const newInviteCode = crypto.randomBytes(15).toString('hex');

    try {
        const invite = new Invite({
            code: newInviteCode,
            emails: emails.map(email => ({email, used: false}))
        });

        await invite.save();

        return res.json({inviteCode: newInviteCode});
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }

});

export default router;