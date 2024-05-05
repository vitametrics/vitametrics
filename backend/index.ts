import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { commonMiddlewares } from './middleware/common';
import passport from 'passport';
import userRoute from './routes/User';
import logoutRoute from './routes/Logout';
import passportConfig from './util/passport-config';
import authRoute from './routes/Auth';
import loginRoute from './routes/Login';
import orgRoute from './routes/Organization';
import { connectDB } from './middleware/config';
import sgMail from '@sendgrid/mail';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const app = express();
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'", `'${process.env.BASE_URL}'`],
        }
    }
}));
app.use(mongoSanitize());
commonMiddlewares(app);
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
// TODO: Change to /auth
app.use('/', authRoute);
app.use('/org', orgRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute(passport));
app.use('/logout', logoutRoute);

connectDB();

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'Backend is healthy'});
});

app.listen(7970, () => {
    console.log('Listening on port', 7970);
})
