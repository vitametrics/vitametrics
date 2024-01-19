import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import userRoute from './routes/User';
import logoutRoute from './routes/Logout';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './util/swaggerSpec';
import passportConfig from './util/passport-config';
import authRoute from './routes/Auth';
import loginRoute from './routes/Login';
import { connectDB } from './config';

const app = express();
app.use(express.json());
app.use(cookieParser());
passportConfig(passport);
app.use(cors({
    origin: "https://fitbit.seancornell.io",
    credentials: true
}));

app.set('trust proxy', 1);
app.use(passport.initialize());
// testing auth route
app.use('/', authRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute(passport));
app.use('/logout', logoutRoute);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();
app.listen(7970, () => {
    console.log('Listening on port 7970');
})
