import { Request, Response, NextFunction } from 'express';

import { ValidationChain, validationResult } from 'express-validator';
import logger from '../middleware/logger';

export const validationHandler = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation errors: ${errors.array()}`);
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  };
};
