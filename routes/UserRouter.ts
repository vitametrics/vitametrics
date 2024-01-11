import express, { Request, Response, Router } from 'express';

import auth from '../middleware/auth';

const router: Router = express.Router();

router.use(express.json());

router.post('/newuser', async (req: Request, res: Response) => {

    // TODO: user creation

});

// router.get('/data', auth, async (req: Request, res: Response)=> {}) once auth middleware is implemented

router.get('/data', async (req: Request, res: Response) => {

    // TODO: get user data

});

export default router;

