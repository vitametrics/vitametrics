import express, {Request, Response} from 'express';
import { Parser } from 'json2csv';
import Organization from '../models/Organization';
import Device from '../models/Device';
import verifyToken from '../middleware/verifyToken';
import fetchAndStoreData from '../util/fetchData';

const router = express.Router();

interface CustomRequest extends Request {
    userId: string; // Add userId property
}

router.post('/sync-data/:deviceId', verifyToken, async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId;

        const deviceId = req.params.deviceId;

        const organization = await Organization.findOne({ members: { $elemMatch: { _id: userId } } });

        if (!organization) {
            return res.status(404).json({msg: 'Organization not found'});
        } else if (!organization.fitbitAccessToken) {
            return res.status(400).json({msg: 'Organization does not have a Fitbit access token'});
        }

        const orgId = organization.orgId;

        const device = await Device.findOne({deviceId, orgId});

        if (!device) {
            return res.status(404).json({msg: 'Device not found or access denied'});
        }

        try {
            await fetchAndStoreData(orgId, organization.userId, organization.fitbitAccessToken, 'day');
        } catch (err) {
            if (err.message === 'Token refresh failed') {
                // If token refresh fails, return an error response
                return res.status(400).json({ msg: 'Failed to refresh Fitbit access token' });
            }
        }
        
        return res.status(200).json({msg: 'Fitbit data synced successfully'});
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});


router.get('/download-data/:deviceId', verifyToken, async (req: CustomRequest, res: Response) => {
    try {

        // this should use tokens in the future...

        const userId = req.userId;

        const deviceId = req.params.deviceId;

        const organization = await Organization.findOne({ members: { $elemMatch: { _id: userId } } });

        if (!organization) {
            return res.status(404).json({msg: 'Organization not found'});
        } else if (!organization.fitbitAccessToken) {
            return res.status(400).json({msg: 'Organization does not have a Fitbit access token'});
        }

        const orgId = organization.orgId;

        const device = await Device.findOne({ deviceId, orgId}).lean();

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
