import express, { Request, Response } from 'express';
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
         const ownerExists = await User.findOne({email: ownerEmail});
         if (ownerExists) {
             return res.status(404).json({ msg: 'Organization already exists under this email' });
         }


        const newUserId = crypto.randomBytes(16).toString('hex');
        const newOrgId = crypto.randomBytes(16).toString('hex');
        const tempPassword = crypto.randomBytes(16).toString('hex');

        const newUser = new User({
            userId: newUserId,
            email: ownerEmail,
            password: await argon2.hash(tempPassword), // randomly generated password to be emailed to user
            emailVerfToken: crypto.randomBytes(32).toString('hex'),
            emailVerified: false,
            languageLocale: 'en-US',
            distanceUnit: 'en-US',
            orgId: newOrgId
        });

        await newUser.save();

        const newOrganization = new Organization({
            orgName,
            orgId: newOrgId,
            ownerId: newUserId,
            ownerName,
            ownerEmail,
	    members: [newUser._id] // need to add for org data stuff (i hate how i did this)
        });

        await newOrganization.save();

        await sendEmail({
            to: ownerEmail,
            subject: 'Your New Organization Account',
            text: `Your account has been created. Your login is: ${ownerEmail}\nYour temporary password is: ${tempPassword}`,
        });

        return res.status(201).json({ msg: 'Organization created successfully', organization: newOrganization });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

export default router;
