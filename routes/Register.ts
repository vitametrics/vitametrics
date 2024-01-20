import express, {Request, Response} from 'express';
import User from '../models/User';
import Invite from '../models/Invite';
import bcrypt from 'bcryptjs';
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

        const userWithInviteCode = await Invite.findOne({inviteCode});

        if (!userWithInviteCode) {
            return res.status(400).json({msg: 'Invalid invite code'});
        }

        const newUser = new User({
            userId: '',
            email: email,
            password: '',
            fitbitAccessToken: '',
            languageLocale: 'en-US',
            distanceUnit: 'en-US'
        });

        bcrypt.genSalt(10, (err: Error, salt: string) => {
            if (err) throw err;

            bcrypt.hash(password, salt, async (err: Error, hash: string) => {
                if (err) throw err;

                newUser.password = hash;

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
                                        distanceUnit: user.distanceUnit
                                    }
                                });
                            }
                        )
                    });
            });
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server error'});
    }

    return;
});

export default router;