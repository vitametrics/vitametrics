import express, { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import { PassportStatic } from 'passport';
import fetchAndStoreDevices from '../util/fetchDevices';
import jwt from 'jsonwebtoken';

const loginRoute = (passport: PassportStatic): Router => {
    const router = express.Router();

    /**
     * @swagger
     * /login:
     *   post:
     *     summary: User login
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - login
     *               - password
     *             properties:
     *               login:
     *                 type: string
     *                 description: Email for the user.
     *               password:
     *                 type: string
     *                 description: Password for the user.
     *     responses:
     *       200:
     *         description: Login successful, returns user data and JWT token.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: JWT token for authentication.
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                     name:
     *                       type: string
     *                     email:
     *                       type: string
     *                 msg:
     *                   type: string
     *                   description: Message indicating successful login.
     *       401:
     *         description: Authentication failed.
     *       500:
     *         description: Internal Server Error.
     */

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error, user: IUser | false, info: { msg: string } | any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json(info);
            }

            jwt.sign(
                { id: user.userId },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' },
                async (err: Error, token: string) => {
                    if (err) {
                        return res.status(500).json({ msg: 'Internal Server Error' });
                    }

                    if (user.fitbitAccessToken) {
                        try {
                            await fetchAndStoreDevices(user.userId, user.fitbitAccessToken);
                        } catch (err) {
                            console.error("Error fetching devices: ", err);
                            return res.status(500).json({ msg: 'Error fetching devices' });
                        }
                    } else {
                        // TODO: Handle users without fitbit oauth2 token. maybe put notification in dasboard with a banner until they do?
                        console.log('Fitbit OAuth2 token not available for user');
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
