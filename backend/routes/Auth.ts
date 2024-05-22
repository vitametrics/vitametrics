import express, { Request, Response } from 'express';

import axios from 'axios';
import crypto from 'crypto';

import verifySession from '../middleware/verifySession';
import CodeVerifier from '../models/CodeVerifier';
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

router.get('/auth', async (req: Request, res: Response) => {
  const projectId = req.cookies.projectId;
  const userId = req.query.userId as string || req.user?.userId as string;

  if (!projectId) {
    return res.status(400).send('projectId cookie is missing');
  }

  const codeVerifier = crypto.randomBytes(32).toString('hex');
  const codeChallenge = createCodeChallenge(codeVerifier);

  try {
    await new CodeVerifier({ value: codeVerifier, projectId, userId: userId }).save();
    const queryParams = new URLSearchParams({
      client_id: process.env.FITBIT_CLIENT_ID as string,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope:
        'activity heartrate location nutrition oxygen_saturation respiratory_rate settings sleep social temperature weight profile',
      redirect_uri: process.env.REDIRECT_URI as string,
    });

    const authUrl = `https://www.fitbit.com/oauth2/authorize?${queryParams.toString()}`;

    res.cookie('userId', userId);
    res.redirect(authUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/callback', async (req: Request, res: Response) => {
  const projectId = req.cookies.projectId;
  const userId = req.cookies.userId;
  const code = req.query.code as string;

  if (!projectId) {
    return res.status(400).send('projectId cookie is missing');
  }

  try {
    const verifier = await CodeVerifier.findOne({ projectId, userId})
      .sort({ createdAt: -1 })
      .limit(1);
    if (!verifier) {
      return res.status(400).send('Invalid session or code verifier not found');
    }
    const codeVerifier = verifier.value;
    await CodeVerifier.findOneAndDelete(verifier._id); // cleanup verifier from db

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
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).send('Project not found');
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).send('User not found');
    } else if (user.isTempUser) {
      user.fitbitUserId = fitbitUserID;
      user.fitbitAccessToken = accessToken;
      user.fitbitRefreshToken = refreshToken;

      await user.save();
      res.redirect('/');
      return;
    } else {
      project.fitbitUserId = fitbitUserID;
      project.fitbitAccessToken = accessToken;
      project.fitbitRefreshToken = refreshToken;
  
      await project.save();
      res.clearCookie('userId');
          // this should not handle redirects. fine for now i guess.
      res.redirect(`/dashboard/project?id=${projectId}&view=overview`);
      return;
    }

  } catch (err) {
    console.error('Error handling OAuth callback:', err);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }

  return;
});

export default router;
