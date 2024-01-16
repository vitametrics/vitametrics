import express, { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import { PassportStatic } from 'passport';
import jwt from 'jsonwebtoken';

const loginRoute = (passport: PassportStatic): Router => {
    const router = express.Router();

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error, user: IUser | false, info : { msg: string} | any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json(info);
            }

            jwt.sign(
                {id: user.userId},
                process.env.JWT_SECRET as string,
                {expiresIn: '1h'},
                (err: Error, token: string) => {
                    if (err) {
                        return res.status(500).json({msg: 'Internal Server Error'});
                    }

                    return res.json({
                        token,
                        user: {
                            id: user.userId,
                            name: user.fullName,
                            email: user.email,
                            // TODO: add more fields to return data
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