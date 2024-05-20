import express, { Request, Response } from 'express';

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import helmet from 'helmet';
import passport from 'passport';

import { commonMiddlewares } from './middleware/common';
import { connectDB } from './middleware/config';
import logger from './middleware/logger';
import passportConfig from './middleware/util/passport-config';
import configureRoutes from './routes';
import axios from 'axios';

dotenv.config({ path: '../.env' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'", `'${process.env.BASE_URL}'`],
      },
    },
  })
);

commonMiddlewares(app);
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
configureRoutes(app, passport);

connectDB();

app.get('/version', async (req: Request, res: Response) => {
  const backendPackageJson = require('./package.json');
  const frontendPackageJson = require('../frontend/package.json');

  const backendVersion = backendPackageJson.version;
  const frontendVersion = frontendPackageJson.version;

  try {

    const response = await axios.get('https://api.github.com/repos/vitametrics/vitametrics/releases/latest');
    const latestRelease = response.data;
    const latestVersion = latestRelease.tag_name;

    const isBackendUpToDate = backendVersion === latestVersion;
    const isFrontendUpToDate = frontendVersion === latestVersion;

    return res.json({
      backendVersion,
      frontendVersion,
      latestVersion,
      isBackendUpToDate,
      isFrontendUpToDate
    });
  } catch (error) {
    logger.error(`Error fetching latest release: ${error}`);
    return res.status(500).json({ msg: 'Error fetching latest release' });
  }
})

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ status: 'success', message: 'Backend is healthy' });
});

app.listen(7970, () => {
  logger.info('Listening on port 7970');
});
