import argon2 from 'argon2';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../../models/User';
import logger from '../logger';

const passportConfig = (passport: passport.Authenticator) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: 'Incorrect email' });
          }

          const match = await argon2.verify(user.password, password);
          if (!match) {
            return done(null, false, { message: 'Incorrect password' });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findOne({ userId: id }).exec();
      done(null, user);
    } catch (error) {
      logger.error(`Error deserializing user: ${error}`);
      done(error, null);
    }
  });
};

export default passportConfig;
