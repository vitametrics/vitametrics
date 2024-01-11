import express, { Request, Response, Router } from 'express';
import User from '../models/User';
import generateUniqueApiKey from '../util/api';

const router: Router = express.Router();

router.use(express.json());

// TODO: test this

router.post('/newuser', async (req: Request, res: Response) => {

    // TODO: better checking for userId validation so you can't spam registrations
    const userId = req.body.userId;

    if (!userId) {
        return res.status(500).json({msg: 'Internal Server Error'});
    } else {
        try { 
            const newUser = new User({
                userId: userId,
                heart_rate: [],
                accellerometer: []
            });

            const apiKey = await generateUniqueApiKey(32);
            newUser.apiKey = apiKey;

            await newUser.save();

            return res.status(200);

        } catch(err) {
            return res.status(500).json({msg: 'Internal Server Error'});
        }
    }

});

router.post('/upload', async (req: Request, res: Response) => {
    const {userId, apiKey, heart_rate, accellerometer} = req.body;

    if (!userId || !apiKey || !heart_rate) {
        res.status(500).json({ msg: "500 Internal Server Error"});
    }

    const user = await User.findOne({apiKey: apiKey, userId: userId});
    if (user) {
        user.heart_rate.push(heart_rate);
        user.accellerometer.push(accellerometer);
    } else {
        res.status(401).json({msg: "Unauthorized"});
    }
});

// router.get('/data', auth, async (req: Request, res: Response)=> {}) once auth middleware is implemented

// router.get('/data', async (req: Request, res: Response) => {

//     // TODO: get user data

// });

export default router;

