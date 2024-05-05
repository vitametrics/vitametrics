import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';

export const commonMiddlewares = async (app: express.Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.BASE_URL as string,
    credentials: true
  }));

  if (process.env.NODE_ENV as string === 'dev') {
    app.use(morgan('dev'));
  }
  
  app.use(session({
    secret: process.env.SESSION_SECRET as string, 
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI as string}),
    cookie: {
      secure: process.env.NODE_ENV as string === 'production' ? true : false,
      sameSite: process.env.NODE_ENV as string === 'production' ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 1 // 1 hour session expiry
    }
  }));
  app.set('trust proxy', 1);
};
