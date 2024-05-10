import { Request, Response, NextFunction } from 'express';
import { CustomReq } from '../types/custom';
import User from '../models/User';

const verifyRole = (role: string) => {

    return async (expressReq: Request, res: Response, next: NextFunction) => {
    
        const req = expressReq as CustomReq;
        
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized - User not logged in' });
        }

        try {

            const user = await User.findOne({userId: req.user.userId});

            if (!user) {
                return res.status(404).json({msg: 'User not found'});
            }

            if (user.role !== role && user.role !== 'owner') {
                return res.status(403).json({ msg: 'Access denied - User does not have the required role' });
            }

            return next();
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    }
};

export default verifyRole;