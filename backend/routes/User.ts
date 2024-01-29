import express, {Request, Response} from 'express';
import { Parser } from 'json2csv';
import Organization, { IOrganization } from '../models/Organization';
import Device from '../models/Device';
import fetchAndStoreData from '../util/fetchData';
import verifySession from '../middleware/verifySession';
import refreshToken from '../middleware/refreshFitbitToken';
import checkOrgMembership from '../middleware/checkOrg';
import { CustomReq } from '../util/customReq';

const router = express.Router();

router.post('/sync-data/:deviceId', verifySession, checkOrgMembership, refreshToken, async (req: CustomReq, res: Response) => {
    try {
        const organization: IOrganization = req.organization as IOrganization;

        try {
            const deviceId = req.params.deviceId;

            const orgId = organization.orgId;

            const device = await Device.findOne({deviceId, orgId});

            if (!device) {
                return res.status(404).json({msg: 'Device not found or access denied'});
            }

            try {
                await fetchAndStoreData(orgId, organization.userId, organization.fitbitAccessToken, 'day');
            } catch (err) {
                return res.status(400).json({ msg: 'Failed to refresh Fitbit access token' });
            }
            
            return res.status(200).json({msg: 'Fitbit data synced successfully'});
            
            } catch (err) {
                console.error(err);
                return res.status(500).json({msg: 'Internal Server Error'});
            }


        } catch (err) {
            return res.status(500).json({msg: 'Internal server error'});
        }
});


router.get('/download-data/:deviceId', verifySession, checkOrgMembership, refreshToken, async (req: CustomReq, res: Response) => {
    
    const organization: IOrganization = req.organization as IOrganization;

    try {
        const deviceId = req.params.deviceId;

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
