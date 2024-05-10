import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const findUser = async (req: Request, res: Response, next: NextFunction ) => {
    const userId = req.params.userId || req.body.userId;
    const user = await User.findOne({ userId });
    if (!user) {
        return res.status(404).json({ msg: 'User not found'});
    }
}