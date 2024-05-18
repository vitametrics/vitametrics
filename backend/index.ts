import express, { Request, Response } from 'express';

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import helmet from 'helmet';
import passport from 'passport';

import { commonMiddlewares } from './middleware/common';
import { connectDB } from './middleware/config';
import { handleError } from './middleware/errorHandler';
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
app.use(handleError);

connectDB();

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Backend is healthy' });
});

app.listen(7970, () => {
  console.log('Listening on port', 7970);
});
