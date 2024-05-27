import express from 'express';

import { query, body, param } from 'express-validator';

import {
  getProjectInfo,
  fetchDevicesHandler,
  fetchDataHandler,
  fetchIntradayDataHandler,
  downloadDataHandler,
  changeDeviceName,
  getCachedFiles,
  downloadCachedFile,
} from '../controllers/ProjectController';
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
  asyncHandler(getProjectInfo)
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
  asyncHandler(changeDeviceName)
);

router.post(
  '/fetch-devices',
  verifySession,
  checkProjectMembership,
  refreshFitbitToken,
  asyncHandler(fetchDevicesHandler)
);

router.get(
  '/fetch-data',
  verifySession,
  validationHandler([
    query('id').not().isEmpty().withMessage('Device ID is required'),
    query('startDate').not().isEmpty().withMessage('Start date is required'),
    query('endDate').not().isEmpty().withMessage('End date is required'),
  ]),
  checkProjectMembership,
  refreshFitbitToken,
  asyncHandler(fetchDataHandler)
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
  asyncHandler(fetchIntradayDataHandler)
);

router.get(
  '/get-cached-files',
  verifySession,
  validationHandler([query('deviceId').optional()]),
  checkProjectMembership,
  refreshFitbitToken,
  asyncHandler(getCachedFiles)
);

router.get(
  '/cache/download/:id',
  verifySession,
  validationHandler([
    param('id').not().isEmpty().withMessage('File ID is required'),
  ]),
  checkProjectMembership,
  asyncHandler(downloadCachedFile)
);

router.get(
  '/download-data',
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
  asyncHandler(downloadDataHandler)
);

export default router;
