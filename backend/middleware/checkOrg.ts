import { Request, Response, NextFunction } from 'express';
import Organization, { IOrganization } from '../models/Organization';
import User from '../models/User';
import { CustomReq } from '../types/custom';

const checkOrgMembership = async (expressReq: Request, res: Response, next: NextFunction) => {
    
    const req = expressReq as CustomReq;
    
    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized - User not logged in' });
    }

    const userId = req.user.userId;

    try {

        const user = await User.findOne({ userId: userId}).populate('organizations');

        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }

        if (!user.organizations.length && user.role !== 'owner') {
            return res.status(403).json({ msg: 'Access denied - User not a member of any organization' });
        }

        const orgId = req.body.projectId || req.query.projectId;
        const organizationIds = user.organizations.map(org => org._id);
        console.log(organizationIds);
        console.log(orgId);
        const matchingOrg = await Organization.findOne({
            orgId: orgId,
            _id: { $in: organizationIds }
        });

        if (!matchingOrg && user.role !== 'owner') {
            return res.status(403).json({ msg: 'Access denied - User not a member of the organization' });
        }

        req.organization = matchingOrg as IOrganization;

        console.log('was in org');
        return next();
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export default checkOrgMembership;