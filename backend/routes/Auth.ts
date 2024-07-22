import express, { Request, Response } from 'express';

import axios from 'axios';
import crypto from 'crypto';
import { Types } from 'mongoose';

import CodeVerifier from '../models/CodeVerifier';
import FitbitAccount from '../models/FitbitAccount';
import Project from '../models/Project';
import User from '../models/User';

const router = express.Router();

function createCodeChallenge(codeVerifier: string): string {
  const hash = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64');
  return hash.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateState(projectId: string, userId: string): string {
  const timestamp = Date.now().toString();
  const randomString = crypto.randomBytes(16).toString('hex');
  const data = `${projectId}:${userId}:${timestamp}:${randomString}`;
  const hash = crypto.createHash('sha256').update(data).digest('base64');
  return Buffer.from(`${data}:${hash}`).toString('base64');
}

function verifyState(state: string): {
  projectId: string;
  userId: string;
  isValid: boolean;
} {
  try {
    const decoded = Buffer.from(state, 'base64').toString();
    const [projectId, userId, timestamp, randomString, hash] =
      decoded.split(':');

    const data = `${projectId}:${userId}:${timestamp}:${randomString}`;
    const computedHash = crypto
      .createHash('sha256')
      .update(data)
      .digest('base64');

    const isValid =
      computedHash === hash && Date.now() - parseInt(timestamp) < 3600000; // 1 hour token expiry (shouldnt even hit this limit)

    return { projectId, userId, isValid };
  } catch (error) {
    return { projectId: '', userId: '', isValid: false };
  }
}

router.get('/auth', async (req: Request, res: Response) => {
  const projectId = req.query.projectId as string;
  const userId = (req.query.userId as string) || (req.user?.userId as string);
  const token = req.query.token as string;

  if ((!projectId || !userId) && !token) {
    return res.status(400).json({ msg: 'Missing fields' });
  }

  const project = await Project.findOne({ projectId });
  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  try {
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    const codeChallenge = createCodeChallenge(codeVerifier);

    let state;

    if (token) {
      state = generateState(projectId, token);

      await new CodeVerifier({
        value: codeVerifier,
        projectId,
        userId: token,
        state,
      }).save();
    } else {

      state = generateState(projectId, userId);

      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const isMember = project.isMember(user._id as Types.ObjectId);
      if (!isMember) {
        return res
          .status(403)
          .json({ msg: 'User is not a member of this project' });
      }

      await new CodeVerifier({
        value: codeVerifier,
        projectId,
        userId,
        state,
      }).save();
    }

    const queryParams = new URLSearchParams({
      client_id: process.env.FITBIT_CLIENT_ID as string,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: 'login consent',
      scope:
        'activity heartrate location nutrition oxygen_saturation respiratory_rate settings sleep social temperature weight profile',
      redirect_uri: process.env.REDIRECT_URI as string,
      state: state,
    });

    const authUrl = `https://www.fitbit.com/oauth2/authorize?${queryParams.toString()}`;

    res.redirect(authUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!state) {
    return res.status(400).json({ msg: 'Missing state' });
  }

  try {
    const { projectId, userId, isValid } = verifyState(state);

    if (!isValid) {
      return res.status(400).json({ msg: 'Invalid or expired state' });
    }

    const verifier = await CodeVerifier.findOne({ state, projectId, userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!verifier) {
      return res.status(400).json({ msg: 'Code verifier not found' });
    }

    const codeVerifier = verifier.value;

    await CodeVerifier.findOneAndDelete(verifier._id); // cleanup verifier from db

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      const extAcc = await FitbitAccount.findOne({ idToken: userId });
      if (extAcc) {
        const params = new URLSearchParams({
          client_id: process.env.FITBIT_CLIENT_ID as string,
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.REDIRECT_URI as string,
          code_verifier: codeVerifier,
        });

        const tokenResponse = await axios.post(
          'https://api.fitbit.com/oauth2/token',
          params.toString(),
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;

        const profileResponse = await axios.get(
          'https://api.fitbit.com/1/user/-/profile.json',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const fitbitUserID = profileResponse.data.user.encodedId;

        if (extAcc.userId === fitbitUserID) {
          extAcc.accessToken = accessToken;
          extAcc.refreshToken = refreshToken;
          extAcc.lastTokenRefresh = new Date();
          extAcc.idToken = '';

          await extAcc.save();
          return res.redirect('/');
        } else {
          return res.status(404).json({ msg: 'User or account not found' });
        }
      } else {
        return res.status(404).json({ msg: 'User or account not found' });
      }
    } else {
      const isMember = project.isMember(user._id as Types.ObjectId);
      if (!isMember) {
        return res
          .status(403)
          .json({ msg: 'User is not a member of this project' });
      }

      const params = new URLSearchParams({
        client_id: process.env.FITBIT_CLIENT_ID as string,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI as string,
        code_verifier: codeVerifier,
      });
  
      const tokenResponse = await axios.post(
        'https://api.fitbit.com/oauth2/token',
        params.toString(),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;
  
      const profileResponse = await axios.get(
        'https://api.fitbit.com/1/user/-/profile.json',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      const fitbitUserID = profileResponse.data.user.encodedId;
  
      let fitbitAccount = await FitbitAccount.findOne({
        userId: fitbitUserID,
        project_id: project._id,
      });
  
      if (fitbitAccount) {
        fitbitAccount.accessToken = accessToken;
        fitbitAccount.refreshToken = refreshToken;
        fitbitAccount.lastTokenRefresh = new Date();
      } else {
        fitbitAccount = new FitbitAccount({
          userId: fitbitUserID,
          accessToken,
          refreshToken,
          lastTokenRefresh: new Date(),
          project_id: project._id,
        });
      }
  
      await fitbitAccount.save();
  
      if (!project.fitbitAccounts.includes(fitbitAccount._id as Types.ObjectId)) {
        project.fitbitAccounts.push(fitbitAccount._id as Types.ObjectId);
        await project.save();
      }
  
      // this should not handle redirects. fine for now i guess.
      return res.redirect(`/dashboard/project?id=${projectId}&view=overview`);
    }
  } catch (err) {
    console.error('Error handling OAuth callback:', err);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }

  return;
});

export default router;
