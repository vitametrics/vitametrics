import express, { Request, Response } from 'express';
import Invite from '../models/Invite';
import crypto from 'crypto';

const router = express.Router();

router.post('/create-invite', async (req: Request, res: Response) => {

    const token = req.headers['x-access-token'];
    const { emails } = req.body;
    
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!emails || !Array.isArray(emails) || emails.length == 0) {
        return res.status(400).json({ msg: 'Emails required' });
    }

    const newInviteCode = crypto.randomBytes(32).toString('hex');

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