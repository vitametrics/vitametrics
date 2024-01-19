import { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin';

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    
    const adminToken = req.headers['admin-token'];

    if (!adminToken) {
        return res.status(403).json({msg: 'Unauthorized access'});
    }

    const storedToken = await Admin.findOne();
    if (!storedToken || !await storedToken.compareToken(adminToken as string)) {
        return res.status(403).json({msg: 'Unauthorized access'});
    }

    next();

    return;
};

export default verifyAdmin;