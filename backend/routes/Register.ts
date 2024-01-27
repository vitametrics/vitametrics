import express, {Request, Response} from 'express';
import User from '../models/User';
import Invite from '../models/Invite';
import Organization from '../models/Organization';
import argon2 from 'argon2';
import crypto from 'crypto';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {

    const { email, password, inviteCode} = req.body;

    console.log(email, password, inviteCode);

    if (!email || !password || !inviteCode) {
        return res.status(400).json({msg: 'Please enter all fields'});
    }

    try {
        const user = await User.findOne({email});

        if (user) {
            if (user.email == email.toString()) {
                return res.status(400).json({msg: 'User already exists'});
            }
        }

        const validInviteCode = await Invite.findOne({code: inviteCode});

        if (!validInviteCode) {
            return res.status(400).json({msg: 'Invalid invite code'});
        } else if (!validInviteCode.isActive) {
            return res.status(400).json({msg: 'Invite code is no longer valid'});
        }

        validInviteCode.usageCount++;
        if (validInviteCode.usageCount >= validInviteCode.maxUses) {
            validInviteCode.isActive = false;
        }

        await validInviteCode.save();

        const hashedPassword = await argon2.hash(password);

        const newUser = new User({
            userId: crypto.randomBytes(16).toString('hex'),
            email: email,
            password: '',
            languageLocale: 'en-US',
            distanceUnit: 'en-US',
            orgId: validInviteCode.orgId
        });

        newUser.password = hashedPassword;

        await newUser.save();

        if (validInviteCode.orgId) {
            await Organization.updateOne(
                { orgId: validInviteCode.orgId },
                { $addToSet: { members: newUser._id } }
            );
        }

        req.logIn(newUser, (err: Error) => {
            if (err) {
                return res.status(500).json({ msg: 'Error during session creation' });
            }

            return res.json({
                user: {
                    id: newUser.userId,
                    email: newUser.email,
                    languageLocale: newUser.languageLocale,
                    distanceUnit: newUser.distanceUnit,
                    orgId: newUser.orgId
                },
                msg: 'Registered successfully'
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Internal Server Error'});
    }

    return;
});

export default router;
