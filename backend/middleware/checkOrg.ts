import { Response, NextFunction } from 'express';
import Organization from '../models/Organization';
import User from '../models/User';
import { CustomReq } from '../util/customReq';

const checkOrgMembership = async (req: CustomReq, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized - User not logged in' });
    }

    const userId = req.user.userId;

    try {

        const user = await User.findOne({userId: userId});

	if (!user) {
	    return res.status(404).json({msg: 'User not found'});
	}

        const organization = await Organization.findOne({ members: user._id });

        if (!organization) {
            return res.status(403).json({ msg: 'Organization not found' });
        } else if (organization.ownerId != userId) {
            return res.status(403).json({ msg: 'Access denied - User not a member of any organization', data: `user._id: ${user._id}` });
	}

        req.organization = organization;
        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export default checkOrgMembership;
