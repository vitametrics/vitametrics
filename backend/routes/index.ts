import { Express } from 'express';
import { PassportStatic } from 'passport';
import userRoute from '../routes/User';
import logoutRoute from '../routes/Logout';
import authRoute from '../routes/Auth';
import loginRoute from '../routes/Login';
import ownerRoute from '../routes/Owner';
import adminRoute from '../routes/Admin';
import projectRoute from '../routes/Project';

export default function configureRoutes(app: Express, passport: PassportStatic) {

    app.use('/auth', authRoute);
    app.use('/project', projectRoute);
    app.use('/user', userRoute);
    app.use('/owner', ownerRoute);
    app.use('/admin', adminRoute);
    app.use('/login', loginRoute(passport));
    app.use('/logout', logoutRoute);

}