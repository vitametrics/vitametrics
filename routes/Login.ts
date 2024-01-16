import express, { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import { PassportStatic } from 'passport';
import jwt from 'jsonwebtoken';

const loginRoute = (passport: PassportStatic): Router => {
    const router = express.Router();

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
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

    router.get('/logout', (req: Request, res: Response) => {
		req.session.destroy(err => {
			if(err) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Error destroying session:', err);
					return res.json({ success: false, message: 'Error logging out' });
				}
				return res.json({ success: false, message: 'An error occured.' });
			} 
			res.clearCookie('token');
			return res.json({ success: true });
		});
	});

    return router;
}

export default loginRoute;