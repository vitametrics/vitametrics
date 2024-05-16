import { Express } from 'express';
import { PassportStatic } from 'passport';
import userRoute from './User';
import logoutRoute from './Logout';
import authRoute from './Auth';
import loginRoute from './Login';
import ownerRoute from './Owner';
import adminRoute from './Admin';
import projectRoute from './Project';

export default function configureRoutes(app: Express, passport: PassportStatic) {
  app.use('/auth', authRoute);
  app.use('/project', projectRoute);
  app.use('/user', userRoute);
  app.use('/owner', ownerRoute);
  app.use('/admin', adminRoute);
  app.use('/login', loginRoute(passport));
  app.use('/logout', logoutRoute);
}
