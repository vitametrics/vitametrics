import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

export const commonMiddlewares = async (app: express.Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.BASE_URL as string,
    credentials: true
  }));
  
  app.use(session({
    secret: process.env.SESSION_SECRET as string, 
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.NODE_ENV as string === 'production' ? process.env.PROD_DB_URI as string : process.env.DEV_DB_URI }) as MongoStore,
    cookie: {
      secure: process.env.NODE_ENV as string === 'production' ? true : false,
      sameSite: process.env.NODE_ENV as string === 'production' ? 'none' : 'lax',
      httpOnly: true,
    }
  }));
  app.set('trust proxy', 1);
};
