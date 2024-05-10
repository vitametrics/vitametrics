import axios from 'axios';
import Project from '../models/Project';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

async function refreshToken(req: Request, res: Response, next: NextFunction) {

    const user = req.user as IUser;
    if (!user) {
        return res.status(401).json({ msg: 'Unauthorized - User not found' });
    }

    const projects = await Project.find({ '_id': { $in: user.projects}});

    if (!projects.length) {
        return res.status(403).json({ msg: 'No projects found or user not a member of any projects'});
    }

    for (const project of projects) {
        const { fitbitAccessToken, fitbitRefreshToken, lastTokenRefresh } = project;

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
        } catch (err: any) {
            if (err.response && err.response.data?.error[0]?.errorType === 'expired_token') {
                const refreshResponse = await axios.post('https://api.fitbit.com/oauth2/token', `grant_type=refresh_token&refresh_token=${fitbitRefreshToken}`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
                    }
                });

                const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;

                await Project.findByIdAndUpdate(project._id, {
                    fitbitAccessToken: newAccessToken,
                    fitbitRefreshToken: newRefreshToken,
                    lastTokenRefresh: new Date()
                });

                return next();
            } else {
                console.error(err);
                return res.status(500).json({ msg: 'Internal server error' });
            }
        }
    }

    return res.status(403).json({ msg: 'No valid Fitbit access token available'});
}

export default refreshToken;
