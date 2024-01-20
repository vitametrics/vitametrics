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
import { connectDB } from './middleware/config';
import { regenerateToken } from './util/adminTokenManager';

const app = express();
commonMiddlewares(app);
passportConfig(passport);
app.use(passport.initialize());
// testing auth route
app.use('/', authRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute(passport));
app.use('/logout', logoutRoute);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

regenerateToken();

connectDB();
app.listen(7970, () => {
    console.log('Listening on port 7970');
})
