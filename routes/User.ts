import express, {Request, Response} from 'express';
import { Parser } from 'json2csv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import Device from '../models/Device';
import verifyAdmin from '../middleware/verifyAdmin';

const router = express.Router();

router.post('/create-user', verifyAdmin, async (req: Request, res: Response) => {

    try {
        console.log(req.body);
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            userId: '',
            email: email,
            password: hashedPassword,
            fitbitAccessToken: '',
            fitbitRefreshToken: '',
            languageLocale: '',
            distanceUnit: ''
        });

        await newUser.save();

        return res.status(201).json({ msg: 'User account created successfully!'});

    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

/**
 * @swagger
 * /user/download-data/{deviceId}:
 *   get:
 *     summary: Downloads specific device data in CSV format
 *     tags: [Data Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The device ID
 *     responses:
 *       200:
 *         description: Returns a CSV file containing the device's data
 *       403:
 *         description: Unauthorized access. Requires valid JWT token.
 *       404:
 *         description: Device not found or access denied
 *       500:
 *         description: Internal Server Error
 */


router.get('/download-data/:deviceId', async (req: Request, res: Response) => {
    try {
        const deviceId = req.params.deviceId;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).send({msg: 'Unauthorized access - No token'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const userId = decoded.id;

        const device = await Device.findOne({ deviceId, userId}).lean();

        if (!device) {
            return res.status(404).json({msg: 'Device not found or access denied'});
        }

        const fields = ['deviceId', 'deviceType', 'heartRateData', 'sleepData'];
        const json2csv = new Parser({fields});
        const csvData = json2csv.parse(device);

        res.setHeader('Content-disposition', 'attachment; filename=device-data.csv');
        res.set('Content-Type', 'text/csv');

        return res.status(200).send(csvData);


    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

export default router;
