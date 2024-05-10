import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

const verifyRole = (role: string) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as IUser;
        if (!user) {
            return res.status(401).json({ msg: 'Unauthorized - User not logged in' });
        }

        if (user.role !== role && user.role !== 'owner') {
            return res.status(403).json({ msg: 'Access denied - User does not have the required role' });
        }
        next();
    }
};

export default verifyRole;