import express from 'express';
import { commonMiddlewares } from './middleware/common';
import passport from 'passport';
import userRoute from './routes/User';
import logoutRoute from './routes/Logout';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './util/swaggerSpec';
import passportConfig from './util/passport-config';
import authRoute from './routes/Auth';
import loginRoute from './routes/Login';
import adminRoute from './routes/Admin';
import registerRoute from './routes/Register';
import { connectDB } from './middleware/config';

const app = express();
commonMiddlewares(app);
passportConfig(passport);
app.use(passport.initialize());
// testing auth route
app.use('/', authRoute);
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute(passport));
app.use('/logout', logoutRoute);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();
app.listen(7970, () => {
    console.log('Listening on port 7970');
})
