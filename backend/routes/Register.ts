import express, {Request, Response} from 'express';
import User from '../models/User';
import Invite from '../models/Invite';
import Organization from '../models/Organization';
import argon2 from 'argon2';
import crypto from 'crypto';
import {body, validationResult} from 'express-validator';

const router = express.Router();

router.post('/', [
    body('email')
        .not().isEmpty().withMessage('Please provide an email')
        .isString().withMessage('Email must be a string')
        .custom(email => {
            return User.findOne({email: email}).then(user => {
                if (user) {
                   return Promise.reject('Email already is use!');
                }
                return true;
            });
        }),
    body('password').not()
        .isEmpty().withMessage('Password cannot be empty')
        .isString().withMessage('Password must be a string')
        .trim().escape(),
    body('inviteCode')
        .not().isEmpty().withMessage('Invite code cannot be empty')
        .isString().withMessage('Invite code must be a string')
        .trim().escape()
        .custom(code => {
            return Invite.findOne({code: code}).then(found => {
                if (!found) {
                    return Promise.reject('Invalid invite code!');
                } else if (!found.isActive) {
                    return Promise.reject('Invite Code is no longer valid!');
                }
                return true;
            });
    })
], async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, inviteCode} = req.body;

    try {

        const validInviteCode = await Invite.findOne({code: inviteCode});

        if (!validInviteCode) {
            return res.status(400).send('Please enter an invite code!');
        } else if (!validInviteCode.isActive) {
            return res.status(400).send('Invite code is no longer active!');
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
