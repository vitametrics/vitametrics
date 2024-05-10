import express from 'express';
import AdminController from '../controllers/AdminController';
import verifySession from '../middleware/verifySession';
import verifyRole from '../middleware/verifyRole';
import checkProjectMembership from '../middleware/checkProj';
import { body, query, validationResult } from 'express-validator';
import { asyncHandler } from '../handlers/asyncHandler';
import { validationHandler } from '../handlers/validationHandler';

const router = express.Router();

const createProjectValidation = [
    body('projectName').not().isEmpty().withMessage('Project name is required')
];

const memberIdValidation = [
    body('userId').not().isEmpty().withMessage('No userId provided')
];

const projectIdValidation = [
    query('projctId').not().isEmpty().withMessage('No projectId provided')
];

const memberInfoValidations = [
    body('email').isEmail().withMessage('Invalid email'),
    body('name').not().isEmpty().withMessage('Name is required'),
    body('role').not().isEmpty().withMessage('Role is required'),
    ...projectIdValidation
];

router.post('/create-project', 
    verifySession,
    verifyRole('admin'),
    validationHandler(createProjectValidation),
    asyncHandler(AdminController.createProject)
);

router.post('/delete-project',
    verifySession,
    checkProjectMembership,
    verifyRole('admin'),
    validationHandler(projectIdValidation),
    asyncHandler(AdminController.deleteProject)
);

router.post('/add-member',
    verifySession,
    checkProjectMembership,
    verifyRole('admin'),
    validationHandler(memberInfoValidations),
    asyncHandler(AdminController.addMember)
);

router.post('/remove-member',
    verifySession,
    checkProjectMembership,
    verifyRole('admin'),
    validationHandler(memberIdValidation),
    asyncHandler(AdminController.removeMember)
);

export default router;

