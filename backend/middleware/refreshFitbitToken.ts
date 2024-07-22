import { Request, Response, NextFunction } from 'express';

import axios from 'axios';

import logger from './logger';
import FitbitAccount, { IFitbitAccount } from '../models/FitbitAccount';
import Project, { IProject } from '../models/Project';
import { IUser } from '../models/User';

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

    await refreshProjectFitbitAccounts(project);

    next();
  } catch (error) {
    logger.error(`[refreshToken] Error: ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function refreshProjectFitbitAccounts(project: IProject) {
  const fitbitAccounts = await FitbitAccount.find({
    _id: { $in: project.fitbitAccounts },
  });

  for (const account of fitbitAccounts) {
    await refreshFitbitAccount(account);
  }
}

async function refreshFitbitAccount(account: IFitbitAccount) {
  const tokenAgeHours =
    (new Date().getTime() - account.lastTokenRefresh.getTime()) / 3600000;

  if (tokenAgeHours >= 8) {
    try {
      const response = await axios.get(
        'https://api.fitbit.com/1/user/-/profile.json',
        {
          headers: { Authorization: `Bearer ${account.accessToken}` },
        }
      );

      if (response.status === 200) {
        logger.info(
          `[refreshFitbitAccount] Token valid for Fitbit user: ${account.userId}`
        );
        return;
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data?.errors[0].errorType === 'expired_token'
      ) {
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          await refreshFitbitToken(account.refreshToken);

        await FitbitAccount.findByIdAndUpdate(account._id, {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          lastTokenRefresh: new Date(),
        });
      }
    }
  }
}

async function refreshFitbitToken(refreshToken: string) {
  const refreshResponse = await axios.post(
    'https://api.fitbit.com/oauth2/token',
    `grant_type=refresh_token&refresh_token=${refreshToken}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
      },
    }
  );

  return refreshResponse.data;
}
export default refreshToken;
