import { Request, Response, NextFunction } from 'express';

import axios from 'axios';

import logger from './logger';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const user = req.user as IUser;
  if (!user || !user.projects?.length) {
    logger.info('[refreshToken] User not found');
    res.status(401).json({ msg: 'Unauthorized - User not found' });
    return;
  }

  try {
    // refresh token if user is a temp user
    if (user.isTempUser && user.fitbitAccessToken) {
      await refreshUserToken(user);
    }

    // refresh token for each project the user is a member of
    for (const projectId of user.projects) {
      const project = await Project.findById(projectId);
      if (!project) {
        logger.error(`[refreshToken] Project not found: ${projectId}`);
        continue;
      }

      await refreshProjectToken(project);
    }

    next();
  } catch (error) {
    logger.error(`[refreshToken] Error: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
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
            Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
          },
        }
      );

      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      } = refreshResponse.data;

      await User.findByIdAndUpdate(user._id, {
        fitbitAccessToken: newAccessToken,
        fitbitRefreshToken: newRefreshToken,
        lastTokenRefresh: new Date(),
      });
    }
}

async function refreshProjectToken(project: IProject) {
  const { fitbitRefreshToken, lastTokenRefresh } = project;
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
          Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
        },
      }
    );

    const {
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    } = refreshResponse.data;

    await Project.findByIdAndUpdate(project._id, {
      fitbitAccessToken: newAccessToken,
      fitbitRefreshToken: newRefreshToken,
      lastTokenRefresh: new Date(),
    });
  }
}

export default refreshToken;
