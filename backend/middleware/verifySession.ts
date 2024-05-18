import { Request, Response, NextFunction } from 'express';

import HandleResponse from '../types/response';

const verifySession = (req: Request, res: Response, next: NextFunction) => {

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  res.status(401).json(new HandleResponse('Unauthorized: Please log in.', 401));
};

export default verifySession;
