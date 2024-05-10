import express, { Router } from 'express';
import {
    getProjectInfo,
    removeMember,
    fetchDevicesHandler,
    fetchDataHandler,
    fetchIntradayDataHandler,
    downloadDataHandler
} from '../controllers/ProjectController';
import { asyncHandler} from '../handlers/asyncHandler';
import { validationHandler } from '../handlers/validationHandler';
import { query, body } from 'express-validator';

const router = express.Router();

router.get('/info', validationHandler([
    query('projectId').not().isEmpty().withMessage('Project ID is required')
]), asyncHandler(getProjectInfo));

router.post('/remove-member', validationHandler([
    body('userId').not().isEmpty().withMessage('User ID is required')
]), asyncHandler(removeMember));

router.post('/fetch-devices', asyncHandler(fetchDevicesHandler));

router.get('/fetch-data', validationHandler([
    query('id').not().isEmpty().withMessage('Device ID is required'),
    query('startDate').not().isEmpty().withMessage('Start date is required'),
    query('endDate').not().isEmpty().withMessage('End date is required')
]), asyncHandler(fetchDataHandler));

router.get('/fetch-intraday', validationHandler([
    query('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('dataType').not().isEmpty().withMessage('Data type is required'),
    query('date').not().isEmpty().withMessage('Date is required'),
    query('detailLevel').not().isEmpty().withMessage('Detail level is required')
]), asyncHandler(fetchIntradayDataHandler));

router.get('/download-data', validationHandler([
    query('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('dataType').not().isEmpty().withMessage('Data type is required'),
    query('date').not().isEmpty().withMessage('Date is required'),
    query('detailLevel').not().isEmpty().withMessage('Detail level is required')
]), asyncHandler(downloadDataHandler));

export default router;



