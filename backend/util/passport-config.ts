import express, { Router } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import User from '../models/User';
import argon2 from 'argon2';

type PassportVerifyCallback = (error: any, user?: any, info?: any) => void;

const passportConfig = (passport: passport.Authenticator): Router => {

    const router = express.Router();

    router.use(express.json());

    passport.use(new LocalStrategy({ usernameField: 'email' }, 
    async (login: string, password: string, done: PassportVerifyCallback) => {
        try {
            let user = null;
            if (login.includes('@')) {
                user = await User.findOne({email: login});
            } else {
                return done(null, false, { message: 'Invalid credentials'});
            }

            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            const isMatch = await argon2.verify(user.password, password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            return done(null, user);

        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            }
            return done(err);
        };
    }));

    return router;
};

export default passportConfig;