import express from 'express';

import { body, cookie } from 'express-validator';

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
  verifyRole('siteAdmin'),
  validationHandler(createProjectValidation),
  asyncHandler(AdminController.createProject)
);

router.post(
  '/delete-project',
  verifySession,
  checkProjectMembership,
  verifyRole('owner'),
  validationHandler(projectIdValidation),
  asyncHandler(AdminController.deleteProject)
);

router.get(
  '/get-available-users',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler([
    cookie('projectId').not().isEmpty().withMessage('No projectId provided'),
  ]),
  asyncHandler(AdminController.getAvailableUsers)
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

router.post(
  '/change-project-email',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler([
    body('newOwnerEmail').isEmail().withMessage('Invalid email'),
    ...projectIdValidation,
  ]),
  asyncHandler(AdminController.changeProjectOwnerEmail)
);

router.post(
  '/change-project-name',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler([
    body('newProjectName')
      .not()
      .isEmpty()
      .withMessage('Project name is required'),
    ...projectIdValidation,
  ]),
  asyncHandler(AdminController.changeProjectName)
);

router.post(
  '/change-project-description',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler([
    body('newProjectDescription')
      .not()
      .isEmpty()
      .withMessage('Project description is required'),
    ...projectIdValidation,
  ]),
  asyncHandler(AdminController.changeProjectDescription)
);

router.get(
  '/download-log',
  verifySession,
  verifyRole('admin'),
  validationHandler([
    body('logType').not().isEmpty().withMessage('Log type is required'),
  ]),
  asyncHandler(AdminController.downloadLog)
);

export default router;
