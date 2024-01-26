import express, { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import { PassportStatic } from 'passport';
import jwt from 'jsonwebtoken';

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

            const userId = user.userId;

            jwt.sign(
                { id: userId },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' },
                async (err: Error, token: string) => {
                    if (err) {
                        return res.status(500).json({ msg: 'Internal Server Error' });
                    }

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 3600000
                    });

                    return res.json({
                        token,
                        user: {
                            id: user.userId,
                            email: user.email,
                            orgId: user.orgId
                        },
                        msg: 'Logged in successfully'
                    });
                }
            );
        })(req, res, next);
    });

    return router;
}

export default loginRoute;
