import express, {Response} from 'express';
import { Parser } from 'json2csv';
import { IOrganization } from '../models/Organization';
import fetchAndStoreData from '../util/fetchData';
import fetchDevices from '../util/fetchDevices';
import verifySession from '../middleware/verifySession';
import refreshToken from '../middleware/refreshFitbitToken';
import checkOrgMembership from '../middleware/checkOrg';
import { CustomReq } from '../util/customReq';
import User from '../models/User';
import Organization from "../models/Organization"
import { sendEmail } from '../util/emailUtil';
import { param, query, validationResult } from 'express-validator';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: '192.168.1.101',
    database: 'physiobit',
    password: 'MsWHXSNun4LUaZHT4tTCjdc',
    port: 5432
});

const router = express.Router();

// user session authentication status
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

// get organization info
router.get('/org/info', verifySession, checkOrgMembership, [
    query('orgId').not().isEmpty().withMessage('No orgId provided')
], async (req: CustomReq, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { orgId } = req.query;


    const org = await Organization.findOne({ orgId: orgId });

    if (!org) {
        return res.status(
            404).json({ msg: 'Organization not found' });
    }

    const members = await User.find({
        '_id': { $in: org.members }
    });
    

    return res.status(200).json({
        organization: org, 
        members: members 
    });
});

// send user verification email
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

// verify user email 
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
});

// fetch devices from timescale
router.get('/fetch-devices', verifySession, checkOrgMembership, async (req: CustomReq, res: Response) => {
    
    if (!req.organization) {
        return res.status(401).json({msg: 'Unauthorized'});
    }

    const orgId = req.organization.orgId;

    try {

        const result = await pool.query(`
            SELECT device_id, device_type, last_sync_date, battery
            FROM devices
            WHERE organization_id = $1
        `, [orgId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'No devices found for this organization.' });
        }

        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(`Error fetching devices for organization ${orgId}: `, err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// fetch devices from fitbit
router.post('/fetch-devices/fitbit', verifySession, checkOrgMembership, refreshToken, async(req: CustomReq, res: Response) => {

    if (!req.organization) {
        return res.status(401).json({msg: 'Unauthorized'});
    }

    try {
        const orgId = req.organization.orgId;
        const orgUserId = req.organization.userId;
        const accessToken = req.organization.fitbitAccessToken;

        await fetchDevices(orgUserId, accessToken, orgId);

        return res.status(200).json({msg: 'Success!'});

    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error!'});
    }
});

// sync device data by id with fitbit
router.post('/sync-data/:deviceId', verifySession, checkOrgMembership, refreshToken, [
    param('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('startDate').isISO8601().withMessage('Start date is required and must be in YYYY-MM-DD format'),
    query('endDate').isISO8601().withMessage('End date is required and must be in YYYY-MM-DD format')
], async (req: CustomReq, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const organization: IOrganization = req.organization as IOrganization;
        const deviceId = req.params.deviceId;
        const orgId = organization.orgId;
        const orgUserId = organization.userId;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        if (!deviceId) {
            return res.status(500).json({msg: 'Please provide a device Id'});
        }

        await fetchAndStoreData(orgId, orgUserId, organization.fitbitAccessToken, deviceId, startDate, endDate);

        return res.status(200).json({ msg: 'Fitbit data synced successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal server error'});
    }
});

// fetch device data from timescale by device id
router.get('/fetch-device-data/:deviceId', verifySession, checkOrgMembership, refreshToken, [
    param('deviceId').not().isEmpty().withMessage('Device ID is required')
], async (req: CustomReq, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { deviceId } = req.params;
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const dataType = typeof req.query.dataType === 'string' ? req.query.dataType : undefined;

    if (!startDate || !endDate) {
        return res.status(400).json({msg: 'Dates required'});
    }

    try {
        let query = '';
        const queryParams: (string | undefined)[] = [deviceId];

        if (dataType === 'heart_rate') {
            query = 'SELECT date, resting_hr AS value FROM heart_rate_data WHERE device_id = $1';
        } else if (dataType === 'steps') {
            query = 'SELECT date, steps as value FROM steps_data WHERE device_id = $1';
        } else {
            return res.status(400).json({msg : 'Invalid or missing data type parameters'});
        }

        if (startDate && endDate) {
            query += ' AND date BETWEEN $2 and $3';
            queryParams.push(startDate, endDate);
        }

        query += ' ORDER BY date ASC';

        const result = await pool.query(query, queryParams);

        if (result.rowCount === 0) {
            return res.status(404).json({msg: 'No data found for this device'});
        }


        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(`Error fetching device data from TimescaleDB for device ${deviceId}: `, err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
})

// download data from timescale by device id
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

        const orgDeviceId = await Organization.findOne({ orgId, devices: deviceId}).lean();
        if (!orgDeviceId) {
            return res.status(404).json({msg: 'Device not found in organization'});
        }

        const deviceCheckResult = await pool.query(`SELECT 1 FROM devices WHERE device_id = $1 AND organization_id = $2`);
        if (deviceCheckResult.rowCount === 0) {
            return res.status(404).json({msg: 'Something is wrong with your registered device! Please contact support!'});
        }

        const heartRateResult = await pool.query(`SELECT date, resting_HR FROM heart_rate_data WHERE device_id = $1 AND organization_id = $2 ORDER BY date`, [deviceId, orgId]);
        const stepsResult = await pool.query(`SELECT date, steps FROM steps_data WHERE device_id = $s ORDER BY date`, [deviceId]);


        const csvRows = [
            ...heartRateResult.rows.map(row => ({
                dataType: 'Heart Rate',
                date: row.date.toISOString().split('T')[0].replace(/-/g, '/'),
                HR: row.resting_hr
            })),
            ...stepsResult.rows.map(row => ({
                dataType: 'Steps',
                date: row.date.toISOString().split('T')[0].replace(/-/g, '/'),
                Steps: row.steps
            }))
        ]

        // const csvRows = heartRateResult.rows.map(row => ({
        //     deviceId,
        //     dataType: 'Heart Rate',
        //     date: row.date,
        //     resting_HR: row.value
        // }));

        const parser = new Parser();
        const csvData = parser.parse(csvRows);

        res.setHeader('Content-disposition', 'attachment; filename=heart-rate-data.csv');
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csvData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

export default router;
