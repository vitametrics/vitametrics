import { Request, Response, NextFunction } from 'express';

import logger from './logger';
import { IUser } from '../models/User';

const verifyRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    if (!user) {
      logger.error('[verifyRole] User not logged in');
      res.status(401).json({ msg: 'Unauthorized - User not logged in' });
      return;
    }

    if (user.role !== role && user.role !== 'owner') {
      logger.error(
        '[verifyRole] Access denied - User does not have the required role'
      );
      res
        .status(403)
        .json({ msg: 'Access denied - User does not have the required role' });
      return;
    }
    next();
  };
};

export default verifyRole;
