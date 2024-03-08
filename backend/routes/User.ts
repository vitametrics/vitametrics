import express, { Response } from 'express';
// import { Parser } from 'json2csv';
import { IOrganization } from '../models/Organization';
import fetchDevices from '../util/fetchDevices';
import verifySession from '../middleware/verifySession';
import refreshToken from '../middleware/refreshFitbitToken';
import checkOrgMembership from '../middleware/checkOrg';
import { CustomReq } from '../util/customReq';
import User from '../models/User';
import Organization from "../models/Organization"
import { sendEmail } from '../util/emailUtil';
import { query, validationResult } from 'express-validator';
import axios from 'axios';
import { error } from 'console';
const router = express.Router();


async function fetchIntradayData(userId: string, accessToken: string, dataType: string, date: string) {
    const baseUrl = `https://api.fitbit.com/1/user/${userId}/activities`;
    let url;
    if (dataType === 'heart_rate') {
        url = `${baseUrl}/heart/date/${date}/1d/1min.json`;
    } else if (dataType === 'steps') {
        url = `${baseUrl}/steps/date/${date}/1d/1min.json`;
    } else {
        throw new Error('Invalid data type');
    }

    try {
        const response = await axios.get(url, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        });
        console.log(response.data);
    } catch (err) {
        console.error('Error fetching data from Fitbit: ', error);
        throw error;
    }
}

// user session authentication status
router.get('/auth/status', async (req: CustomReq, res: Response) => {

    if (req.isAuthenticated && req.isAuthenticated()) {

        let hasFitbitAccountLinked = false;
        let isOrgOwner = false;
        const emailVerified = req.user.emailVerified;

        await Organization.findOne({ orgId: req.user.orgId }).then(found => {
            if (found && found.fitbitAccessToken !== "" && found.ownerId == req.user.userId) {
                hasFitbitAccountLinked = true;
                isOrgOwner = true;
            } else if (found && found.fitbitAccessToken !== "") {
                hasFitbitAccountLinked = true;
            }
        })

        return res.json({
            isAuthenticated: true,
            user: {
                id: req.user.userId,
                email: req.user.email,
                orgId: req.user.orgId,
                isEmailVerified: emailVerified,
                isOrgOwner: isOrgOwner,
                isAccountLinked: hasFitbitAccountLinked
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
        return res.status(400).json({ errors: errors.array() });
    }

    const { orgId } = req.query;


    const org = await Organization.findOne({ orgId: orgId });

    if (!org) {
        return res.status(404).json({ msg: 'Organization not found' });
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

    const user = await User.findOne({ email: req.user.email });

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
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ emailVerfToken: req.query.token });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired verification token' });
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
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// fetch devices from fitbit
router.post('/fetch-devices', verifySession, checkOrgMembership, refreshToken, async (req: CustomReq, res: Response) => {

    if (!req.organization) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    try {
        const orgId = req.organization.orgId;
        const orgUserId = req.organization.userId;
        const accessToken = req.organization.fitbitAccessToken;

        await fetchDevices(orgUserId, accessToken, orgId);

        return res.status(200).json({ msg: 'Success!' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error!' });
    }
});

// download data from fitbit by device id
router.get('/download-data', verifySession, checkOrgMembership, refreshToken, [
    query('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('dataType').not().isEmpty().withMessage('You must specify which data to download'),
    query('date').not().isEmpty().withMessage('You must specify a date')
], async (req: CustomReq, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const organization: IOrganization = req.organization as IOrganization;

    try {
        const deviceId = req.query.deviceId;

        const orgId = organization.orgId;

        const orgDeviceId = await Organization.findOne({ orgId, devices: deviceId }).lean();
        if (!orgDeviceId) {
            return res.status(404).json({ msg: 'Device not found in organization' });
        }

        await fetchIntradayData(req.user?.userId, organization.fitbitAccessToken, req.query.dataType as string, req.query.date as string);

        // const parser = new Parser();
        // const csvData = parser.parse(data);

        // res.setHeader('Content-disposition', 'attachment; filename=heart-rate-data.csv');
        // res.set('Content-Type', 'text/csv');
        return res.status(200);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

export default router;
