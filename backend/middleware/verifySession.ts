import { Request, Response, NextFunction } from 'express';
import HandleResponse from '../types/response';

const verifySession = (req: Request, res: Response, next: NextFunction) => {
    console.log('Session ID:', req.sessionID);
    console.log('User:', req.user);

    if (req.isAuthenticated && req.isAuthenticated()) {
        console.log('User is authenticated');
        return next();
    }

    console.log('User is not authenticated');
    res.status(401).json(new HandleResponse("Unauthorized: Please log in.", 401));
};
export default verifySession;