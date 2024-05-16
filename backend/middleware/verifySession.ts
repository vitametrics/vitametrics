import { Request, Response, NextFunction } from 'express';
import HandleResponse from '../types/response';

const verifySession = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    throw new HandleResponse("Unauthorized: Please log in.", 401)
};

export default verifySession;