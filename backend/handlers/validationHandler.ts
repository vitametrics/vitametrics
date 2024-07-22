import { Request, Response, NextFunction } from 'express';

import { ValidationChain, validationResult, body } from 'express-validator';

import logger from '../middleware/logger';

export const createProjectValidation = [
  body('projectName').not().isEmpty().withMessage('Project name is required'),
  body('projectDescription').optional(),
];

export const memberIdValidation = [
  body('userId').not().isEmpty().withMessage('No userId provided'),
];

export const projectIdValidation = [
  body('projectId').not().isEmpty().withMessage('No projectId provided'),
];

export const memberInfoValidations = [
  body('email').isEmail().withMessage('Invalid email'),
  body('name').not().isEmpty().withMessage('Name is required'),
  body('role').not().isEmpty().withMessage('Role is required'),
  ...projectIdValidation,
];

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
