import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import HandleResponse from '../types/response';

export const findUser = async (req: Request, res: Response, next: NextFunction ) => {
    const userId = req.params.userId || req.body.userId;
    const user = await User.findOne({ userId });
    if (!user) {
        throw new HandleResponse("User not found", 404);
    }
}