import express, {Request, Response} from 'express';
import { Parser } from 'json2csv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import Device from '../models/Device';
import verifyToken from '../middleware/verifyToken';
import fetchAndStoreData from '../util/fetchData';

const router = express.Router();

interface CustomRequest extends Request {
    userId: string; // Add userId property
}


/**
 * @swagger
 * /user/sync-data/{deviceId}:
 *   post:
 *     summary: Sync Fitbit data for a specific device to the user account
 *     tags: [User Management]
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
 *         description: Fitbit data for the specific device synced successfully
 *       400:
 *         description: User does not have a Fitbit access token or failed to refresh token
 *       403:
 *         description: Unauthorized access. Requires valid JWT token.
 *       404:
 *         description: Device not found or access denied
 *       500:
 *         description: Internal Server Error
 */
router.post('/sync-data/:deviceId', verifyToken, async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId;

        const deviceId = req.params.deviceId;

        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }

        if (!user.fitbitAccessToken) {
            return res.status(400).json({msg: 'User does not have a Fitbit access token'});
        }

        const device = await Device.findOne({userId, deviceId});

        if (!device) {
            return res.status(404).json({msg: 'Device not found or access denied'});
        }

        try {
            await fetchAndStoreData(userId, user.fitbitAccessToken, 'day');
        } catch (err) {
            if (err.message === 'Token refresh failed') {
                // If token refresh fails, return an error response
                return res.status(400).json({ msg: 'Failed to refresh Fitbit access token' });
            }
        }

        await fetchAndStoreData(userId, user.fitbitAccessToken, 'day');

        return res.status(200).json({msg: 'Fitbit data synced successfully'});
        
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
