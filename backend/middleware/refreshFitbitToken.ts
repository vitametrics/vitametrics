import axios from 'axios';
import Organization from '../models/Organization';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

async function refreshToken(req: Request, res: Response, next: NextFunction) {

    const user = req.user as IUser;
    if (!user) {
        return res.status(401).json({ msg: 'Unauthorized - User not found' });
    }

    const organization = await Organization.findOne({ orgId: user.orgId});

    if (!organization) {
        return res.status(403).json({ msg: 'Organization not found in middleware' });
    } else if (!organization.members.some(memberId => memberId.equals(user._id))) {
        return res.status(403).json({ msg: 'Access denied - User not a member of any organization', data: `user._id: ${user._id}` });
    }

    const { fitbitAccessToken, fitbitRefreshToken, lastTokenRefresh } = organization;

    const tokenAge = lastTokenRefresh ? (new Date().getTime() - new Date(lastTokenRefresh).getTime()) / (1000 * 60 * 60) : Infinity;

    if (tokenAge < 8) {
        return next();
    }

    try {
        const response = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
            headers: { 'Authorization': `Bearer ${fitbitAccessToken}` }
        });

        if (response.status === 200) {
            return next();
        }
        
    } catch (error: any) {
        if (error.response && error.response.data?.errors[0].errorType === 'expired_token') {
            const refreshResponse = await axios.post('https://api.fitbit.com/oauth2/token', `grant_type=refresh_token&refresh_token=${fitbitRefreshToken}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
                }
            });

            const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;

            await Organization.findOneAndUpdate({ ownerId: user.userId }, {
                fitbitAccessToken: newAccessToken,
                fitbitRefreshToken: newRefreshToken
            });

            organization.lastTokenRefresh  = new Date();
            await organization.save();
            return next();
        } else {
            return res.status(500).json({ msg: 'Error refreshing Fitbit access token', error: error.response.data});
        }
    }
}

export default refreshToken;
