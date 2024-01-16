import express, { Router } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import User from '../models/User';
import bcrypt from 'bcryptjs';

type PassportVerifyCallback = (error: any, user?: any, info?: any) => void;

const passportConfig = (passport: passport.Authenticator): Router => {

    const router = express.Router();

    router.use(express.json());

    passport.use(new LocalStrategy({ usernameField: 'login' }, 
    async (login: string, password: string, done: PassportVerifyCallback) => {
        try {
            let user = null;
            if (login.includes('@')) {
                user = await User.findOne({email: login}).lean();
            } 

            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
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