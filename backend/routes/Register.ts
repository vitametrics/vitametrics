import express, {Request, Response} from 'express';
import User from '../models/User';
import Invite from '../models/Invite';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

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
        }
	

        if (!validInviteCode.isActive) {
            return res.status(400).json({msg: 'Invite code is no longer valid'});
        } else if (!validInviteCode.emails.some(inviteObj => inviteObj.email === email)) {
            return res.status(400).json({msg: 'Invalid invite code'});
        } else if (validInviteCode.emails.find(e => e.email === email)?.used) {
            return res.status(400).json({msg: 'Invite code has already been used for this email'});
        }

        const newUser = new User({
            userId: '',
            email: email,
            password: '',
            fitbitAccessToken: '',
            languageLocale: 'en-US',
            distanceUnit: 'en-US'
        });

        validInviteCode.usageCount += 1;
        validInviteCode.isActive = false;
        validInviteCode.emails.find(e => e.email === email)!.used = true;
        
        await validInviteCode.save();

        try {

            const hashedPassword = await argon2.hash(password);
            newUser.password = hashedPassword;

            await newUser.save()
                .then(user => {
                    jwt.sign(
                        {id: user.userId || user.email},
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
                                    distanceUnit: user.distanceUnit
                                }
                            });
                        }
                    )
                });

        } catch (err) {
            console.error(err);
            return res.status(500).json({msg: 'Internal Server Error'});
        }



    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Internal Server Error'});
    }

    return;
});

export default router;
