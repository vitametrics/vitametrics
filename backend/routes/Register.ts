import express, {Request, Response} from 'express';
import User from '../models/User';
import Invite from '../models/Invite';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
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

        if (!validInviteCode.isActive) {
            return res.status(400).json({msg: 'Invite code has reached its maximum usage limit'});
        }

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

        await newUser.save()
            .then(user => {
                jwt.sign(
                    {id: user.userId},
                    process.env.JWT_SECRET as string,
                    {expiresIn: '1h'},
                    (err, token) => {
                        if (err) throw err;

                        res.json({
                            token,
                            user: {
                                id: user.userId,
                                email: user.email,
                                languageLocale: user.languageLocale,
                                distanceUnit: user.distanceUnit,
                                orgId: user.orgId
                            }
                        });
                    }
                )
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Internal Server Error'});
    }

    return;
});

export default router;
