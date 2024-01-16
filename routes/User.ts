import express, {Request, Response} from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Parser } from 'json2csv';

const router = express.Router();

router.use(express.json());

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user or update an existing user's details
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *               - password
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Unique ID for the user.
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *               password:
 *                 type: string
 *                 description: Password for the user's account.
 *     responses:
 *       200:
 *         description: User registered or updated successfully. Returns JWT token and user details.
 *       400:
 *         description: Bad request, missing required fields.
 *       403:
 *         description: Unauthorized access. Requires valid Fitbit OAuth2 token.
 *       404:
 *         description: User does not exist.
 *       500:
 *         description: Internal server error.
 */


router.post('/register', async(req: Request, res: Response) => {

    const accessToken = req.headers.authorization?.split(' ')[1];
    const {userId, email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields'});
    } else {

        try {
            const user = await User.findOne({userId});

            if (!user) {
                return res.status(404).json({msg: 'User does not exist'});
            } else {
                if (user.fitbitAccessToken !== accessToken) {
                    return res.status(403).json({ msg: 'Unauthorized Access'});
                } else {
                    user.email = email;

                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(password, salt);

                    const updatedUser = await user.save();

                    const token = jwt.sign({id: updatedUser._id}, process.env.JWT_SECRET as string, {expiresIn: 3600});
                    
                    res.json({
                        token,
                        user: {
                            id: updatedUser.userId,
                            email: updatedUser.email,
                            // TODO: return data here
                        }
                    })

                }
            }

        } catch (err) {
            console.error(err);
            return res.status(500).json({msg: 'Internal Server Error'});
        }

    }

    return res.status(500);
});

/**
 * @swagger
 * /user/download-data/{userId}:
 *   get:
 *     summary: Downloads user data in CSV format
 *     tags: [Data Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Returns a CSV file containing the user's data
 *       403:
 *         description: Unauthorized access. Requires valid Fitbit OAuth2 token.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


router.get('/download-data/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({userId}).lean();
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        } else if (user.fitbitAccessToken !== accessToken) {
            return res.status(403).send('Unauthorized access');
        } else {
            const fields = ['userId', 'heart_rate', 'location', 'nutrition', 'oxygen_saturation', 'respiratory_rate', 'temperature', 'weight'];
            const json2csvParser = new Parser({ fields });
            const csvData = json2csvParser.parse(user);

            res.setHeader('Content-disposition', 'attachment; filename=user-data.csv');
            res.set('Content-Type', 'text/csv');

            res.status(200).send(csvData);
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }

    return res.status(500);
});

export default router;
