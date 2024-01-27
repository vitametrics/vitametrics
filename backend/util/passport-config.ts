import express, { Router } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';
import argon2 from 'argon2';
import { IUser } from '../models/User';

type PassportVerifyCallback = (error: any, user?: any, info?: any) => void;

const passportConfig = (passport: passport.Authenticator): Router => {
    const router = express.Router();

    router.use(express.json());

    passport.use(new LocalStrategy({ usernameField: 'email' }, 
        async (email: string, password: string, done: PassportVerifyCallback) => {
            try {
                const user = await User.findOne({ email: email });

                if (!user) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const isMatch = await argon2.verify(user.password, password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                return done(null, user);
            } catch (err) {
                console.error(err);
                return done(err);
            }
        }
    ));

    passport.serializeUser((user: IUser, done) => {
        done(null, user.userId);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err: Error, user: IUser) => {
            done(err, user);
        });
    });

    return router;
};

export default passportConfig;
