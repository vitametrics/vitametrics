import axios from 'axios';
import Project from '../models/Project';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';


async function refreshToken(req: Request, res: Response, next: NextFunction) {

    const user = req.user as IUser;
    if (!user || !user.projects?.length ) {
        return res.status(401).json({ msg: 'Unauthorized - User not found' });
    }

    try {
        for (const projectId of user.projects) {
            const project = await Project.findById(projectId);
            if (!project) continue;

            const { fitbitAccessToken, fitbitRefreshToken, lastTokenRefresh } = project;
            const tokenAgeHours = lastTokenRefresh ? (new Date().getTime() - new Date(lastTokenRefresh).getTime()) / 3600000 : Infinity;

            if (tokenAgeHours >= 8) {
                try {
                    const response = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
                        headers: { 'Authorization': `Bearer ${fitbitAccessToken}` }
                    });

                    if (response.status === 200) {
                        return next();
                    }
                } catch (error) {
                    const refreshResponse = await axios.post('https://api.fitbit.com/oauth2/token', 
                        `grant_type=refresh_token&refresh_token=${fitbitRefreshToken}`, {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
                            }
                        });

                    const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;

                    await Project.findByIdAndUpdate(projectId, {
                        fitbitAccessToken: newAccessToken,
                        fitbitRefreshToken: newRefreshToken,
                        lastTokenRefresh: new Date()
                    });

                    return next();

                } 
            } else {
                // token not expired
                return next();
            }
        }
        // if no projects, skip middleware
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

export default refreshToken;
