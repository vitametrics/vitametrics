import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import passportConfig from './util/passport-config';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import authRoute from './routes/Auth';
import loginRoute from './routes/Login';
import logoutRoute from './routes/Logout';
import userRoute from './routes/User';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './util/swaggerSpec';

dotenv.config();

const DB_URI = process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URI as string : process.env.DEV_DB_URI as string;
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


mongoose.connect(DB_URI)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Could not connect to the database', err));


app.listen(7970, () => {
    console.log('Listening on port 7970');
})
