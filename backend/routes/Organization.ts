import express, {Response} from 'express';
import { query, validationResult } from 'express-validator';
import { DateTime } from 'luxon';
import multer from 'multer';
import crypto from 'crypto';
import verifySession from '../middleware/verifySession';
import checkOrgMembership from '../middleware/checkOrg';
import refreshToken from '../middleware/refreshFitbitToken';
import { CustomReq } from '../util/customReq';
import fetchDevices from '../util/fetchDevices';
import fetchIntradayData from '../util/fetchIntraday';
import { sendEmail } from '../util/emailUtil';
import Organization, {IOrganization} from '../models/Organization';
import User from '../models/User';
const router = express.Router();
const upload = multer({ dest: '../../uploads'});
const fitAddon = require('../fitaddon/build/Release/fitaddon.node')

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

// fetch device data
// router.get('/fetch-device-data', [

// ],verifySession, checkOrgMembership, refreshToken, async (req: CustomReq, res: Response) => {

//     if (!req.organization) {
//         return res.status(401).json({msg: 'Unauthorized'});
//     }

//     try {
//         const orgId = req.organization.orgId;
//         const orgUserId = req.organization.userId;
//         const accessToken = req.organization.fitbitAccessToken;

        
//     }

// });

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

        const deviceResponse = await fetchDevices(orgUserId, accessToken, orgId);

        return res.status(200).json(deviceResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error!' });
    }
});

router.post('/upload', upload.single('fitfile'), (req: CustomReq, res: Response) => {

    if (req.file) {
        const decodedData = fitAddon.decodeFIT(req.file.path);
        return res.json({success: true, decodedData});
    } else {
        return res.status(400).send('no file uploaded');
    }

})

// download data from fitbit by device id
router.get('/download-data', verifySession, checkOrgMembership, refreshToken, [
    query('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('dataType').not().isEmpty().withMessage('You must specify which data to download'),
    query('date').not().isEmpty().withMessage('You must specify a date'),
    query('detailLevel').not().isEmpty().withMessage('You must specify a detail level')
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

        const data = await fetchIntradayData(organization.userId, organization.fitbitAccessToken, req.query.dataType as string, req.query.date as string, req.query.detailLevel as string);


        const header = "Timestamp,Value\n";
        const rows = data.map((row: { timestamp: DateTime, value: number; }) => `${row.timestamp},${row.value}`).join("\n");
        const csvData = header + rows;
        res.setHeader('Content-disposition', `attachment; filename=${deviceId}-${req.query.dataType}${(req.query.detailLevel as string).toUpperCase()}.csv`);
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csvData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

export default router;