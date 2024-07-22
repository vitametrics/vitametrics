import express from 'express';

import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import morgan from 'morgan';

export const commonMiddlewares = async (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(
    cors({
      origin: process.env.BASE_URL,
      credentials: true,
    })
  );

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    app.use(morgan('dev'));
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI as string }),
      cookie: {
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 3600000, // 1 hour session expiry
      },
    })
  );
  app.set('trust proxy', 1);
};
