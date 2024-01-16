import express, { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import passport from 'passport';

const loginRoute = (): Router => {
    const router = express.Router();

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error, user: IUser | false, info : { msg: string} | any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json(info);
            }

            req.logIn(user, (err: Error) => {
                if (err) {
                    return next(err);
                }

                return res.json({msg: 'Logged in successfully', user});
            });
        })(req, res, next);
    });

    return router;
}

export default loginRoute;