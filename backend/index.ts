import express, { Request, Response } from 'express';

import sgMail from '@sendgrid/mail';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import helmet from 'helmet';
import passport from 'passport';
import path from 'path';

import { commonMiddlewares } from './middleware/common';
import { connectDB } from './middleware/config';
import logger from './middleware/logger';
import passportConfig from './middleware/util/passport-config';
import configureRoutes from './routes';

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
  const versionPackagePath = path.join(__dirname, '..', 'package.json');

  const packageJson = JSON.parse(
    fs.readFileSync(versionPackagePath, 'utf8')
  );

  const siteVersion = packageJson.version;

  try {
    const response = await axios.get(
      'https://api.github.com/repos/vitametrics/vitametrics/releases/latest'
    );
    const latestRelease = response.data;
    const latestVersion = latestRelease.tag_name;

    const isUpToDate = siteVersion === latestVersion;

    return res.json({
      siteVersion,
      latestVersion,
      isUpToDate,
    });
  } catch (error) {
    logger.error(`Error fetching latest release: ${error}`);
    return res.status(500).json({ msg: 'Error fetching latest release' });
  }
});

app.get('/health', (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ status: 'success', message: 'Backend is healthy' });
});

app.listen(7970, () => {
  logger.info('Listening on port 7970');
});
