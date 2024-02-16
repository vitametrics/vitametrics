import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

export const commonMiddlewares = async (app: express.Application) => {
  app.use(express.json());
  app.use(cookieParser());
  if (process.env.NODE_ENV === 'production') {
    app.use(cors({
      origin: process.env.BASE_URL as string,
      credentials: true
    }));
  }

  app.use(session({
    secret: process.env.SESSION_SECRET as string, 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.PROD_DB_URI as string }) as any,
    cookie: {
      secure: true,
      sameSite: 'lax',
      httpOnly: true,
    }
  }));
  app.set('trust proxy', 1);
};
