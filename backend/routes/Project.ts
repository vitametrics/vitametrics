import express from 'express';

import { query, body, param } from 'express-validator';

import ProjectController from '../controllers/ProjectController';
import { asyncHandler } from '../handlers/asyncHandler';
import { validationHandler } from '../handlers/validationHandler';
import checkProjectMembership from '../middleware/checkProjectMembership';
import refreshFitbitToken from '../middleware/refreshFitbitToken';
import verifyRole from '../middleware/verifyRole';
import verifySession from '../middleware/verifySession';

const router = express.Router();

router.get(
  '/info',
  verifySession,
  validationHandler([
    query('projectId').not().isEmpty().withMessage('Project ID is required'),
  ]),
  checkProjectMembership,
  asyncHandler(ProjectController.getProjectInfo)
);

router.post(
  '/change-device-name',
  verifySession,
  validationHandler([
    body('deviceId').not().isEmpty().withMessage('Device ID is required'),
    body('deviceName').not().isEmpty().withMessage('Device name is required'),
  ]),
  checkProjectMembership,
  verifyRole('admin'),
  asyncHandler(ProjectController.changeDeviceName)
);

router.get(
  '/fitbit-accounts',
  verifySession,
  checkProjectMembership,
  asyncHandler(ProjectController.getProjectFitbitAccounts)
);

router.post(
  '/unlink-fitbit-account',
  verifySession,
  validationHandler([
    body('fitbitUserId')
      .not()
      .isEmpty()
      .withMessage('Fitbit user ID is required'),
  ]),
  checkProjectMembership,
  asyncHandler(ProjectController.unlinkFitbitAccount)
);

router.put(
  '/toggle-notifications',
  verifySession,
  checkProjectMembership,
  verifyRole('owner'),
  asyncHandler(ProjectController.toggleNotifications)
);

router.post(
  '/fetch-devices',
  verifySession,
  checkProjectMembership,
  refreshFitbitToken,
  asyncHandler(ProjectController.fetchDevicesHandler)
);

router.get(
  '/fetch-intraday',
  verifySession,
  validationHandler([
    query('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('dataType').not().isEmpty().withMessage('Data type is required'),
    query('date').not().isEmpty().withMessage('Date is required'),
    query('detailLevel')
      .not()
      .isEmpty()
      .withMessage('Detail level is required'),
  ]),
  checkProjectMembership,
  refreshFitbitToken,
  asyncHandler(ProjectController.fetchIntradayDataHandler)
);

router.post(
  '/delete-cached-files',
  verifySession,
  validationHandler([
    body('deviceId').not().isEmpty().withMessage('Device ID is required'),
  ]),
  checkProjectMembership,
  verifyRole('admin'),
  asyncHandler(ProjectController.deleteCachedFiles)
);

router.get(
  '/get-cached-files',
  verifySession,
  validationHandler([query('deviceId').optional()]),
  checkProjectMembership,
  refreshFitbitToken,
  asyncHandler(ProjectController.getCachedFiles)
);

router.get(
  '/cache/download/:id',
  verifySession,
  validationHandler([
    param('id').not().isEmpty().withMessage('File ID is required'),
  ]),
  checkProjectMembership,
  asyncHandler(ProjectController.downloadCachedFile)
);

router.get(
  '/download-data',
  verifySession,
  validationHandler([
    query('deviceIds').not().isEmpty().withMessage('Device IDs are required'),
    query('dataTypes').not().isEmpty().withMessage('Data types are required'),
    query('startDate').not().isEmpty().withMessage('Start date is required'),
    query('endDate').not().isEmpty().withMessage('End date is required'),
    query('detailLevel')
      .not()
      .isEmpty()
      .withMessage('Detail level is required'),
    query('archiveName').optional(),
    query('useDailyData')
      .optional()
      .isBoolean()
      .withMessage('useDailyData must be a boolean'),
  ]),
  checkProjectMembership,
  refreshFitbitToken,
  asyncHandler(ProjectController.downloadDataHandler)
);

export default router;
