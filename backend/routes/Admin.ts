import express, { Request, Response} from 'express';
import verifySession from '../middleware/verifySession';
import verifyRole from '../middleware/verifyRole';
import Organization, { IOrganization } from '../models/Organization';
import Device from '../models/Device';
import User from '../models/User';
import { body, query, validationResult } from 'express-validator';
import checkOrgMembership from '../middleware/checkOrg';
import { CustomReq } from '../types/custom';
import crypto from 'crypto';
import { sendEmail } from '../util/emailUtil';

const router = express.Router();

router.post('/create-project', verifySession, verifyRole('admin'), [
    body('orgName').not().isEmpty().withMessage('Organization name is required')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    const { orgName } = req.body;

    try {

        const existingProject = await Organization.findOne({ orgName: orgName});
        if (existingProject) {
            return res.status(409).json({ msg: 'Project with that name already exists'});
        }

        const newOrgId = crypto.randomBytes(16).toString('hex');

        const user = await User.findOne({ userId: req.user?.userId });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newOrganization = new Organization({
            orgName: orgName,
            orgId: newOrgId,
            ownerId: user.userId,
            ownerName: user.name,
            ownerEmail: user.email,
            members: [user._id]
        });

        const savedOrg = await newOrganization.save();

        user.organizations.push(savedOrg._id);

        await user.save();

        await sendEmail({
            to: user.email,
            subject: 'Your new project',
            text: `You have created a new project: ${orgName}. You can access it using this link: ${process.env.BASE_URL}/user/projects/${newOrgId}`
        });

        return res.status(200).json({ msg: 'Project created successfully' });
        

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/delete-project', verifySession, checkOrgMembership, verifyRole('admin'), [
    query('projectId').not().isEmpty().withMessage('No project id provided')
],async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized'});
    }

    const userId = req.user.userId;
    const projectId = req.query.projectId as string;

    try {

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }

        const organization = await Organization.findOne({ orgId: projectId});

        if (!organization) {
            return res.status(404).json({msg: 'Organization not found'});
        }

        const members = organization.members;
        const deviceIds = organization.devices;

        if (deviceIds && deviceIds.length > 0) {
            await Device.deleteMany( { deviceId: { $in: deviceIds}});
        }

        if (members && members.length > 0) {
            for (const member of members) {
                await User.deleteOne({ _id: member});
            }
        }

        return res.status(200).json({msg: 'Project deleted successfully'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: 'Internal Server Error'});
    }

});

router.post('/add-member', verifySession, checkOrgMembership, verifyRole('admin'), [
    body('email').isEmail().withMessage('Invalid email'),
    body('name').not().isEmpty().withMessage('Name is required'),
    body('role').not().isEmpty().withMessage('Role is required'),
    query('projectId').not().isEmpty().withMessage('No project id provided')
], async (expressReq: Request, res: Response) => {

    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const { email, name, role} = req.body;

    const organization: IOrganization = req.organization as IOrganization;

    try {
        let user = await User.findOne({ email: email});
        if (!user) {

            const newUserId = crypto.randomBytes(16).toString('hex');
            const passwordToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
            
            const newUser = new User({ 
                userId: newUserId,
                email: email,
                name: name,
                role: role,
                setPasswordToken: passwordToken,
                passwordTokenExpiry: tokenExpiry
            });
            await newUser.save();
            user = newUser;
        } 

        await sendEmail({
            to: email,
            subject: 'You have been added to a project',
            text: `You have been invites to the project: ${organization.orgName}. Please set your password using this link to accept the invite: ${process.env.BASE_URL}/set-password?token=${user.setPasswordToken}&projectId=${organization.orgId}`
        })

        return res.status(200).json({ msg: 'Member added successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    
    }

});

router.post('/remove-member', verifySession, checkOrgMembership, verifyRole('admin'), [
    body('userId').not().isEmpty().withMessage('No userId provided')
], async (expressReq: Request, res: Response) => {


    const errors = validationResult(expressReq);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const req = expressReq as CustomReq;
    const { userId } = req.body;
    const organization = req.organization as IOrganization;

    try {
        const user = await User.findOne({userId: userId});

        if (!user) {
            return res.status(404).json({ msg: 'User not found'});
        }

        if (!user.organizations.includes(organization._id)) {
            return res.status(404).json({ msg: 'User not part of the organization'});
        }

        user.organizations = user.organizations.filter(orgId => !orgId.equals(organization._id));
        await user.save();

        organization.members = organization.members.filter(memberId => !memberId.equals(user._id));
        await organization.save();

        await sendEmail({
            to: user.email,
            subject: 'You have been removed from a project',
            text: `You have been removed from ${organization.orgName} by ${req.user?.name}`
        });

        return res.status(200).json({ msg: 'Member removed successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error'});
    }
});

export default router;



