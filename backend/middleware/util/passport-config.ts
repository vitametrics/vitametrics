import argon2 from 'argon2';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../../models/User';

const passportConfig = (passport: passport.Authenticator) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          console.log('email: ', email);
          const user = await User.findOne({ email: email });
          console.log('User: ', user);
          if (!user) {
            return done(null, false, { message: 'Incorrect email' });
          }

          const match = await argon2.verify(user.password, password);
          if (!match) {
            console.log('Password verification failed');
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
      console.error(error);
      done(error, null);
    }
  });
};

export default passportConfig;
