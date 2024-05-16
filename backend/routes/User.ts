import express from 'express';
import UserController from '../controllers/UserController';
import verifySession from '../middleware/verifySession';
import { asyncHandler } from '../handlers/asyncHandler';
import { validationHandler } from '../handlers/validationHandler';
import { body, query } from 'express-validator';

const router = express.Router();

router.get('/auth/status', asyncHandler(UserController.authStatus));

router.post('/check-password-token', verifySession, validationHandler([
    body('token').not().isEmpty().withMessage('Token is required')
]), asyncHandler(UserController.checkPasswordToken));

router.post('/set-password', verifySession, validationHandler([
    body('token').not().isEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 6}).withMessage('Password must be at least 6 characters'),
    query('projectId').optional().isString().withMessage('Invalid project ID')
]), verifySession, asyncHandler(UserController.setPassword));

router.post('/change-password', verifySession, validationHandler([
    body('email').isEmail().withMessage('Valid email is required')
]), asyncHandler(UserController.changePassword));

router.post('/change-email', verifySession, asyncHandler(UserController.changeEmail));

router.post('/send-email-verification', verifySession, asyncHandler(UserController.sendEmailVerification));

router.get('/verify-email', verifySession, validationHandler([
    query('token').not().isEmpty().withMessage('Verification token is required')
]), asyncHandler(UserController.verifyEmail));

router.post('/delete-account', verifySession, validationHandler([
    body('password').not().isEmpty().withMessage('Password is required')
]), asyncHandler(UserController.deleteAccount));


export default router;