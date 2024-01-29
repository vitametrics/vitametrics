import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

export const commonMiddlewares = (app: express.Application) => {
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
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.PROD_DB_URI as string }) as any,
    cookie: { 
      secure: process.env.NODE_ENV as string === 'production',
      sameSite: process.env.NODE_ENV as string === "production" ? "none" : "lax"
    }
  }));
  app.set('trust proxy', 1);
};