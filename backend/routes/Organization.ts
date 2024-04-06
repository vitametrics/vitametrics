import express, {Response} from 'express';
import { query, validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import crypto from 'crypto';
import axios from 'axios';
import verifySession from '../middleware/verifySession';
import checkOrgMembership from '../middleware/checkOrg';
import refreshToken from '../middleware/refreshFitbitToken';
import { CustomReq } from '../util/customReq';
import fetchDevices from '../util/fetchDevices';
import { sendEmail } from '../util/emailUtil';
import Organization, {IOrganization} from '../models/Organization';
import User from '../models/User';
const router = express.Router();

// note: date is YYYY-MM-DD format
async function fetchIntradayData(userId: string, accessToken: string, dataType: string, date: string) {
    const baseUrl = `https://api.fitbit.com/1/user/${userId}/activities`;
    let url;
    if (dataType === 'heart') {
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
        return response.data['activities-' + dataType + '-intraday'].dataset;
    } catch (err) {
        console.error('Error fetching data from Fitbit: ', err);
        throw err;
    }
}

// get organization info
router.get('/info', verifySession, checkOrgMembership, [
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

router.post('/add-member', verifySession, checkOrgMembership, async(req: CustomReq, res: Response) => {

    if (!req.user || !req.organization) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const { email, name} = req.body;
    const organization: IOrganization = req.organization as IOrganization;

    if (req.user.userId !== organization.ownerId) {
        return res.status(403).json({ msg: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({email: email});
        if (user) {
            return res.status(400).json({msg: "User with that email already exists!"});
        }

        const passwordToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        const newUserId = crypto.randomBytes(16).toString('hex');

        const newUser = new User({
            userId: newUserId,
            email,
            name,
            orgId: organization.orgId,
            setPasswordToken: passwordToken,
            passwordTokenExpiry: tokenExpiry
        });

        await newUser.save();

        await Organization.updateOne(
            {orgId: organization.orgId},
            {$addToSet: {members: newUser._id}}
        );

        await sendEmail({
            to: email,
            subject: `You have been invited to ${organization.orgName}`,
            text: `An account has been created for you. Please login using this link: https://${process.env.BASE_URL}/set-password?token=${passwordToken}`
        });

        return res.status(200).json({msg: 'User successfully invited'});

    } catch(err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
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

        console.log(orgUserId, accessToken, orgId);

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

        const data = await fetchIntradayData(req.user.userId, organization.fitbitAccessToken, req.query.dataType as string, req.query.date as string);

        if (data.length === 0) {
            return res.status(404).json({ msg: 'No data found for this date' });
        }
        console.log(data);

        const parser = new Parser();
        const csvData = parser.parse(data);

        res.setHeader('Content-disposition', 'attachment; filename=heart-rate-data.csv');
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csvData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

export default router;