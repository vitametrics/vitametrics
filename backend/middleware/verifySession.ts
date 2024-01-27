import { Request, Response, NextFunction } from 'express';

const verifySession = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
};

export default verifySession;