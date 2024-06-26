import express, {Request, Response} from 'express';
import { query, body, validationResult } from 'express-validator';
import { DateTime } from 'luxon';
// import multer from 'multer';
import crypto from 'crypto';
import verifySession from '../middleware/verifySession';
import checkOrgMembership from '../middleware/checkOrg';
import refreshToken from '../middleware/refreshFitbitToken';
import { CustomReq } from '../types/custom';
import fetchDevices from '../util/fetchDevices';
import fetchIntradayData from '../util/fetchIntraday';
import { sendEmail } from '../util/emailUtil';
import Organization, {IOrganization} from '../models/Organization';
import User, { IUser } from '../models/User';
import fetchData from '../util/fetchData';
const router = express.Router();
// const upload = multer({ dest: '../../uploads'});
// const fitAddon = require('../fitaddon/build/Release/fitaddon.node')

// get organization info
router.get('/info', verifySession, checkOrgMembership as any, [
    query('orgId').not().isEmpty().withMessage('No orgId provided')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    const { orgId } = req.query;


    const members = await User.find({
        '_id': { $in: req.organization?.members }
    });

    return res.status(200).json({
        organization: req.organization,
        members: members
    });
});

router.post('/add-member', verifySession, checkOrgMembership as any, async(expressReq: Request, res: Response) => {

    const req = expressReq as CustomReq;

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
            text: `An account has been created for you. Please login using this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}`
        });

        return res.status(200).json({msg: 'User successfully invited'});

    } catch(err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }

});

router.post('/remove-member', verifySession, checkOrgMembership as any, [
    body('userId').not().isEmpty().withMessage('No userId provided')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    try {

        const removedMemberId = req.body.userId as string;
        const organization = req.organization as IOrganization;

        const user = req.user as IUser;

        if (!user) {
            return res.status(401).json({msg: 'Unauthorized'});
        }
        
        if (organization.ownerId === removedMemberId) {
            return res.status(400).json({msg: 'Cannot remove owner from organization'});
        } else if (user.userId !== organization.ownerId) {
            return res.status(403).json({msg: 'Unauthorized'});
        }

        const userToRemove = await User.findOne({ userId: removedMemberId });
        if (!userToRemove) {
            return res.status(404).json({msg: 'User not found'});
        }

        await userToRemove.deleteOne();

        await Organization.updateOne(
            { orgId: organization.orgId },
            { $pull: { members: userToRemove._id }}
        );

        return res.status(200).json({msg: 'Member removed from organization'});

    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    
    }
});

// fetch devices from fitbit
router.post('/fetch-devices', verifySession, checkOrgMembership as any, refreshToken, async (expressReq: Request, res: Response) => {

    const req = expressReq as CustomReq;

    if (!req.organization) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    try {
        const orgId = req.organization.orgId;
        const orgUserId = req.organization.userId;
        const accessToken = req.organization.fitbitAccessToken;

        const deviceResponse = await fetchDevices(orgUserId, accessToken, orgId);

        return res.status(200).json(deviceResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error!' });
    }
});

// router.post('/upload', upload.single('fitfile'), (req: Request, res: Response) => {

//     if (req.file) {
//         const decodedData = fitAddon.decodeFIT(req.file.path);
//         return res.json({success: true, decodedData});
//     } else {
//         return res.status(400).send('no file uploaded');
//     }

// })

// fetch data from fitbit by device id
router.get('/fetch-data', verifySession, checkOrgMembership as any, refreshToken, [
    query('id').not().isEmpty().withMessage('Device ID is required'),
    query('startDate').not().isEmpty().withMessage('You must specify a start date'),
    query('endDate').not().isEmpty().withMessage('You must specify an end date')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    try {
        const organization = req.organization as IOrganization;
        const deviceId = typeof req.query.id === 'string' ? req.query.id : undefined;
        const orgUserId = organization.userId;
        const startDate = typeof req.query.startDate === 'string' ? req.query.startDate: undefined;
        const endDate = typeof req.query.endDate === 'string' ? req.query.endDate: undefined;

        if (!deviceId) {
            return res.status(500).json({msg: 'Please provide a device id'});
        }

        const data = await fetchData(orgUserId, organization.fitbitAccessToken, startDate, endDate);

        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }
});

// fetch intraday data from fitbit by device id
router.get('/fetch-intraday', verifySession, checkOrgMembership as any, refreshToken, [
    query('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('dataType').not().isEmpty().withMessage('You must specify which data to download'),
    query('date').not().isEmpty().withMessage('You must specify a date'),
    query('detailLevel').not().isEmpty().withMessage('You must specify a detail level')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

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

        return res.status(200).json(data);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// download data from fitbit by device id
router.get('/download-data', verifySession, checkOrgMembership as any, refreshToken, [
    query('deviceId').not().isEmpty().withMessage('Device ID is required'),
    query('dataType').not().isEmpty().withMessage('You must specify which data to download'),
    query('date').not().isEmpty().withMessage('You must specify a date'),
    query('detailLevel').not().isEmpty().withMessage('You must specify a detail level')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

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
