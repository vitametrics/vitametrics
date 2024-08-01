import express from 'express';

import { body } from 'express-validator';

import AdminController from '../controllers/AdminController';
import { asyncHandler } from '../handlers/asyncHandler';
import {
  validationHandler,
  createProjectValidation,
  projectIdValidation,
  memberInfoValidations,
  memberIdValidation,
} from '../handlers/validationHandler';
import checkProjectMembership from '../middleware/checkProjectMembership';
import verifyRole from '../middleware/verifyRole';
import verifySession from '../middleware/verifySession';

const router = express.Router();

router.post(
  '/create-project',
  verifySession,
  validationHandler(createProjectValidation),
  verifyRole('siteAdmin'),
  asyncHandler(AdminController.createProject)
);

router.post(
  '/delete-project',
  verifySession,
  validationHandler(projectIdValidation),
  verifyRole('owner'),
  checkProjectMembership,
  asyncHandler(AdminController.deleteProject)
);

router.get(
  '/get-available-users',
  verifySession,
  verifyRole('admin'),
  checkProjectMembership,
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
  '/change-user-role',
  verifySession,
  checkProjectMembership,
  verifyRole('admin'),
  validationHandler([
    body('userId').not().isEmpty().withMessage('No userId provided'),
    body('role').not().isEmpty().withMessage('Role is required'),
  ]),
  asyncHandler(AdminController.changeUserRole)
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
