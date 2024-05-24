import { Request, Response, NextFunction } from 'express';

import axios from 'axios';

import logger from './logger';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';

async function refreshToken(req: Request, res: Response, next: NextFunction) {

  const user = req.user as IUser;

  try {

    if (user.role === 'siteOwner' || user.role === 'siteAdmin') {
      const projects = await Project.find();
      for (const project of projects) {
        await refreshProjectTokenAndTempUsers(project);
      }
    } else {
      for (const projectId of user.projects) {
        const project = await Project.findOne({ projectId });
        if (!project) {
          logger.error(`[refreshToken] Project not found: ${projectId}`);
          continue;
        }

        await refreshProjectTokenAndTempUsers(project);
      }
    
    }

    next();
    
  } catch (error) {
    logger.error(`[refreshToken] Error: ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function refreshUserToken(user: IUser) {
  const { fitbitRefreshToken, lastTokenRefresh } = user;
  const tokenAgeHours = lastTokenRefresh
    ? (new Date().getTime() - new Date(lastTokenRefresh).getTime()) / 3600000
    : Infinity;

  if (tokenAgeHours >= 8) {
    const refreshResponse = await axios.post(
      'https://api.fitbit.com/oauth2/token',
      `grant_type=refresh_token&refresh_token=${fitbitRefreshToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;

    await User.findByIdAndUpdate(user._id, {
      fitbitAccessToken: newAccessToken,
      fitbitRefreshToken: newRefreshToken,
      lastTokenRefresh: new Date(),
    });
  }
}

async function refreshProjectToken(project: IProject) {
  const { fitbitRefreshToken, lastTokenRefresh } = project;

  if (!fitbitRefreshToken || !lastTokenRefresh) {
    return;
  }

  const tokenAgeHours = lastTokenRefresh
    ? (new Date().getTime() - new Date(lastTokenRefresh).getTime()) / 3600000
    : Infinity;

  if (tokenAgeHours >= 8) {
    const refreshResponse = await axios.post(
      'https://api.fitbit.com/oauth2/token',
      `grant_type=refresh_token&refresh_token=${fitbitRefreshToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;

    await Project.findByIdAndUpdate(project._id, {
      fitbitAccessToken: newAccessToken,
      fitbitRefreshToken: newRefreshToken,
      lastTokenRefresh: new Date(),
    });
  }
}

async function refreshProjectTokenAndTempUsers(project: IProject) {

  await refreshProjectToken(project);


  const tempUsers = await User.find({
    _id: { $in: project.members },
    isTempUser: true,
    fitbitAccessToken: { $exists: true, $ne: null}
  });

  for (const tempUser of tempUsers) {
    await refreshUserToken(tempUser);
  }
}

export default refreshToken;
