import { Request, Response, NextFunction } from 'express';
import logger from './logger';


const verifySession = (req: Request, res: Response, next: NextFunction) => {

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  logger.info('[verifySession] User not logged in')
  res.status(401).json({ msg: 'Unauthorized - User not logged in' });
};

export default verifySession;
