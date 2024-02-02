import express, { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import { PassportStatic } from 'passport';

const loginRoute = (passport: PassportStatic): Router => {
    const router = express.Router();

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error, user: IUser | false, info: { msg: string } | any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json(info);
            }
    
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.json({
                    user: {
                        id: user.userId,
                        email: user.email,
                        orgId: user.orgId
                    },
                    msg: 'Logged in successfully'
                });
            });
        })(req, res, next);
    });

    return router;
}

export default loginRoute;
