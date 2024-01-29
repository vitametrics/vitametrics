import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Organization from '../models/Organization';
import { CustomReq } from '../util/customReq';

const checkOrgMembership = async (req: CustomReq, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized - User not logged in' });
    }

    const userId = req.user.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    try {
        const organization = await Organization.findOne({ members: userObjectId });

        if (!organization) {
            return res.status(403).json({ msg: 'Access denied - User not a member of any organization' });
        }

        req.organization = organization;
        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export default checkOrgMembership;
