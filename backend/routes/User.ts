import express, {Response} from 'express';
import { Parser } from 'json2csv';
import { IOrganization } from '../models/Organization';
import Device from '../models/Device';
import fetchAndStoreData from '../util/fetchData';
import verifySession from '../middleware/verifySession';
import refreshToken from '../middleware/refreshFitbitToken';
import checkOrgMembership from '../middleware/checkOrg';
import { CustomReq } from '../util/customReq';
import User from '../models/User';
import Organization from "../models/Organization"
import { sendEmail } from '../util/emailUtil';
import { param, query, validationResult } from 'express-validator';

const router = express.Router();

router.get('/auth/status', (req: CustomReq, res: Response) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.json({
            isAuthenticated: true,
            user: {
                id: req.user.userId,
                email: req.user.email,
                orgId: req.user.orgId
            }
        });
    } else {
        return res.json({ isAuthenticated: false });
    }
});

router.get('/org/info', async (req, res) => {
    const { orgId } = req.query;


    const org = await Organization.findOne({ orgId: orgId });

    if (!org) {
        return res.status(
            404).json({ msg: 'Organization not found' });
    }

    return res.status(200).json(org);
});

router.post('/send-email-verification', verifySession, async (req: CustomReq, res: Response) => {

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const user = await User.findOne({email: req.user.email});

    if (!user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const verificationLink = `https://physiobit.seancornell.io/api/user/verify-email?token=${user.emailVerfToken}`;

    return sendEmail({
        to: user.email,
        subject: 'Physiobit Email Verification',
        text: `Please verify your email using this link ${verificationLink}`
    });
});

router.get('/verify-email', verifySession, [
    query('token').not().isEmpty().withMessage('No token provided')
], async (req: CustomReq, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = await User.findOne({emailVerfToken: req.query.token});

        if (!user) {
            return res.status(400).json({msg: 'Invalid or expired verification token'});
        }

        if (!req.user || req.user.id !== user._id.toString()) {
            return res.redirect('/dashboard');
        }

        user.emailVerified = true;
        user.emailVerfToken = "";

        await user.save();

        return res.redirect('/dashboard?verified=true');
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
})

router.post('/sync-data/:deviceId', verifySession, checkOrgMembership, refreshToken, [
    param('deviceId').not().isEmpty().withMessage('Device ID is required')
], async (req: CustomReq, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
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


router.get('/download-data/:deviceId', verifySession, checkOrgMembership, refreshToken, [
    param('deviceId').not().isEmpty().withMessage('Device ID is required')
], async (req: CustomReq, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    
    const organization: IOrganization = req.organization as IOrganization;

    try {
        const deviceId = req.params.deviceId;

        const orgId = organization.orgId;

        const device = await Device.findOne({ deviceId, orgId}).lean();

        if (!device) {
            return res.status(400).json({msg: 'No device with provided ID'});
        }

        // process and flatten data
        let csvRows: any = [];
        device.heartRateData.forEach(hrData => {
            csvRows.push({
                deviceId: device.deviceId,
                deviceType: device.deviceType,
                dataType: 'Heart Rate',
                date: hrData.date,
                value: hrData.value
            });
        });

        device.sleepData.forEach(sleepData => {
            csvRows.push({
                deviceId: device.deviceId,
                deviceType: device.deviceType,
                dataType: 'Sleep',
                date: sleepData.date,
                duration: sleepData.duration,
                quality: sleepData.quality
            });
        });

        device.nutritionData.forEach(nutritionData => {
            csvRows.push({
                deviceId: device.deviceId,
                deviceType: device.deviceType,
                dataType: 'Sleep',
                date: nutritionData.date,
                value: nutritionData.value
            })
        });

        const parser = new Parser();
        const csvData = parser.parse(csvRows);


        res.setHeader('Content-disposition', 'attachment; filename=device-data.csv');
        res.set('Content-Type', 'text/csv');

        return res.status(200).send(csvData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

export default router;
