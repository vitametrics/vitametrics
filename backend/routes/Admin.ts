import express from 'express';

import { body } from 'express-validator';

import AdminController from '../controllers/AdminController';
import { asyncHandler } from '../handlers/asyncHandler';
import { validationHandler } from '../handlers/validationHandler';
import checkProjectMembership from '../middleware/checkProjectMembership';
import verifyRole from '../middleware/verifyRole';
import verifySession from '../middleware/verifySession';

const router = express.Router();

const createProjectValidation = [
  body('projectName').not().isEmpty().withMessage('Project name is required'),
  body('projectDescription').optional(),
];

const memberIdValidation = [
  body('userId').not().isEmpty().withMessage('No userId provided'),
];

const projectIdValidation = [
  body('projectId').not().isEmpty().withMessage('No projectId provided'),
];

const memberInfoValidations = [
  body('email').isEmail().withMessage('Invalid email'),
  body('name').not().isEmpty().withMessage('Name is required'),
  body('role').not().isEmpty().withMessage('Role is required'),
  ...projectIdValidation,
];

router.post(
  '/create-project',
  verifySession,
  verifyRole('admin'),
  validationHandler(createProjectValidation),
  asyncHandler(AdminController.createProject)
);

router.post(
  '/delete-project',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler(projectIdValidation),
  asyncHandler(AdminController.deleteProject)
);

router.post(
  '/add-member',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler(memberInfoValidations),
  asyncHandler(AdminController.addMember)
);

router.post(
  '/remove-member',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler(memberIdValidation),
  asyncHandler(AdminController.removeMember)
);

router.get(
  '/download-log',
  verifySession,
  verifyRole('admin'),
  asyncHandler(AdminController.downloadLog)
)

export default router;
