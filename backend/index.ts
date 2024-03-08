import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { commonMiddlewares } from './middleware/common';
import passport from 'passport';
import userRoute from './routes/User';
import logoutRoute from './routes/Logout';
import passportConfig from './util/passport-config';
import authRoute from './routes/Auth';
import loginRoute from './routes/Login';
import adminRoute from './routes/Admin';
import { connectDB } from './middleware/config';
import sgMail from '@sendgrid/mail';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const app = express();
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(mongoSanitize());
commonMiddlewares(app);
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
// TODO: Change to /auth
app.use('/', authRoute);
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute(passport));
app.use('/logout', logoutRoute);

connectDB();

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port', process.env.PORT || 3000);
})
