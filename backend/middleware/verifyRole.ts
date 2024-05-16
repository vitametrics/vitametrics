import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import HandleResponse from '../types/response';

const verifyRole = (role: string) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as IUser;
        if (!user) {
            throw new HandleResponse('Unauthorized - User not logged in', 401);
        }

        if (user.role !== role && user.role !== 'owner') {
            throw new HandleResponse('Access denied - User does not have the required role', 403);
        }
        next();
    }
};

export default verifyRole;