import express from 'express';

import { body, param } from 'express-validator';

import OwnerController from '../controllers/OwnerController';
import { asyncHandler } from '../handlers/asyncHandler';
import { validationHandler } from '../handlers/validationHandler';
import verifyRole from '../middleware/verifyRole';
import verifySession from '../middleware/verifySession';

const router = express.Router();

router.post(
  '/invite-admin',
  verifySession,
  validationHandler([
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').isString().withMessage('Name is required'),
  ]),
  verifyRole('siteOwner'),
  asyncHandler(OwnerController.inviteAdmin)
);
// get all instance users
router.get(
  '/users',
  verifySession,
  verifyRole('siteAdmin'),
  asyncHandler(OwnerController.getUsers)
);

router.get(
  '/fitbit',
  verifySession,
  verifyRole('siteAdmin'),
  asyncHandler(OwnerController.getSiteFitbitAccounts)
);

router.delete(
  '/fitbit/:id',
  verifySession,
  validationHandler([
    param('id').not().isEmpty().withMessage('Fitbit ID is required'),
  ]),
  verifyRole('siteAdmin'),
  asyncHandler(OwnerController.deleteFitbitAccount)
);

// get all instance projects
router.get(
  '/projects',
  verifySession,
  verifyRole('siteAdmin'),
  asyncHandler(OwnerController.getSiteProjects)
);

// edit specific user on instance
router.put(
  '/user/:id',
  verifySession,
  verifyRole('siteAdmin'),
  validationHandler([
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('name').optional().isString().withMessage('Name is required'),
    body('role').optional().isString().withMessage('Role is required'),
  ]),
  asyncHandler(OwnerController.editSiteUser)
);

// edit specific project by id on instance
router.put(
  '/project/:id',
  verifySession,
  verifyRole('siteAdmin'),
  validationHandler([
    body('projectName')
      .optional()
      .isString()
      .withMessage('Project name is required'),
    body('projectDescription')
      .optional()
      .isString()
      .withMessage('Project description is required'),
    body('ownerId').optional().isString().withMessage('Owner ID is required'),
  ]),
  asyncHandler(OwnerController.editSiteProject)
);

// delete user by id on instance
router.delete(
  '/user/:id',
  verifySession,
  validationHandler([
    param('id').not().isEmpty().withMessage('ID is required'),
  ]),
  verifyRole('siteOwner'),
  asyncHandler(OwnerController.deleteSiteUser)
);

// delete project by id on instance
router.delete(
  '/project/:id',
  verifySession,
  validationHandler([
    param('id').not().isEmpty().withMessage('ID is required'),
  ]),
  verifyRole('siteAdmin'),
  asyncHandler(OwnerController.deleteSiteProject)
);

// unlink fitbit account from project
router.put(
  '/unlink-fitbit-account/:id',
  verifySession,
  validationHandler([
    body('projectId').not().isEmpty().withMessage('Project ID is required'),
    param('id').not().isEmpty().withMessage('Fitbit ID is required'),
  ]),
  verifyRole('siteAdmin'),
  asyncHandler(OwnerController.unlinkFitbitAccountFromProject)
);

export default router;
