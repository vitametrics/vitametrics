import { Express } from 'express';

import { PassportStatic } from 'passport';

import adminRoute from './Admin';
import authRoute from './Auth';
import loginRoute from './Login';
import logoutRoute from './Logout';
import ownerRoute from './Owner';
import projectRoute from './Project';
import userRoute from './User';

export default function configureRoutes(
  app: Express,
  passport: PassportStatic
) {
  app.use('/', authRoute);
  app.use('/project', projectRoute);
  app.use('/user', userRoute);
  app.use('/owner', ownerRoute);
  app.use('/admin', adminRoute);
  app.use('/login', loginRoute(passport));
  app.use('/logout', logoutRoute);
}
