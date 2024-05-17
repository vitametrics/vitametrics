import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { commonMiddlewares } from './middleware/common';
import passport from 'passport';
import { connectDB } from './middleware/config';
import sgMail from '@sendgrid/mail';
import helmet from 'helmet';
import configureRoutes from './routes';
import passportConfig from './middleware/util/passport-config';
import { handleError } from './middleware/errorHandler';

dotenv.config({ path: '../.env' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'", `'${process.env.BASE_URL}'`],
        }
    }
}));

commonMiddlewares(app);
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
configureRoutes(app, passport);
app.use(handleError);

connectDB();

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'Backend is healthy'});
});

app.listen(7970, () => {
    console.log('Listening on port', 7970);
})
