import { Request, Response, NextFunction } from 'express';

import axios from 'axios';

import logger from './logger';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const user = req.user as IUser;
  const projectId =
    (req.body.projectId as string) || (req.cookies.projectId as string);

  if (!projectId) {
    logger.error('[refreshToken] Project ID not provided');
    return res.status(400).json({ msg: 'Project ID not provided' });
  }

  logger.info('[refreshToken] Refreshing tokens');

  try {
    let project: IProject | null = null;

    if (user.role === 'siteOwner' || user.role === 'siteAdmin') {
      project = await Project.findOne({ projectId });
    } else {
      project = await Project.findOne({ projectId, members: user._id });
    }

    if (!project) {
      logger.error(`[refreshToken] Project not found: ${projectId}`);
      return res.status(404).json({ msg: 'Project not found' });
    }

    await refreshProjectTokenAndTempUsers(project);

    next();
  } catch (error) {
    logger.error(`[refreshToken] Error: ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function refreshUserToken(user: IUser) {
  const { fitbitAccessToken, fitbitRefreshToken, lastTokenRefresh } = user;

  if (!fitbitAccessToken || !fitbitRefreshToken || !lastTokenRefresh) {
    return;
  }

  const tokenAgeHours = lastTokenRefresh
    ? (new Date().getTime() - new Date(lastTokenRefresh).getTime()) / 3600000
    : Infinity;

  if (tokenAgeHours >= 8) {
    try {
      const response = await axios.get(
        'https://api.fitbit.com/1/user/-/profile.json',
        {
          headers: { Authorization: `Bearer ${fitbitAccessToken}` },
        }
      );

      if (response.status === 200) {
        logger.info(`[refreshUserToken] Token valid for user: ${user.userId}`);
        return;
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data?.errors[0].errorType === 'expired_token'
      ) {
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

        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          refreshResponse.data;

        await User.findByIdAndUpdate(user._id, {
          fitbitAccessToken: newAccessToken,
          fitbitRefreshToken: newRefreshToken,
          lastTokenRefresh: new Date(),
        });
      }
    }
  }
}

async function refreshProjectToken(project: IProject) {
  const { fitbitAccessToken, fitbitRefreshToken, lastTokenRefresh } = project;

  console.log('refreshing project token');

  if (!fitbitAccessToken || !fitbitRefreshToken || !lastTokenRefresh) {
    return;
  }

  const tokenAgeHours = lastTokenRefresh
    ? (new Date().getTime() - new Date(lastTokenRefresh).getTime()) / 3600000
    : Infinity;

  if (tokenAgeHours >= 8) {
    try {
      const response = await axios.get(
        'https://api.fitbit.com/1/user/-/profile.json',
        {
          headers: { Authorization: `Bearer ${fitbitAccessToken}` },
        }
      );

      if (response.status === 200) {
        return;
      }
    } catch (error: any) {
      console.log('errored');

      console.log(fitbitAccessToken);
      console.log(fitbitRefreshToken);
      if (
        error.response &&
        error.response.data?.errors[0].errorType === 'expired_token'
      ) {
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
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          refreshResponse.data;

        await Project.findByIdAndUpdate(project._id, {
          fitbitAccessToken: newAccessToken,
          fitbitRefreshToken: newRefreshToken,
          lastTokenRefresh: new Date(),
        });
      }
    }
  }
}

async function refreshProjectTokenAndTempUsers(project: IProject) {
  await refreshProjectToken(project);

  const tempUsers = await User.find({
    _id: { $in: project.members },
    isTempUser: true,
    fitbitAccessToken: { $exists: true, $ne: null },
  });

  for (const tempUser of tempUsers) {
    await refreshUserToken(tempUser);
  }
}

export default refreshToken;
