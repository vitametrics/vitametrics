import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import RedisStore from 'connect-redis';
import {createClient} from 'redis';

export const commonMiddlewares = (app: express.Application) => {
  app.use(express.json());
  app.use(cookieParser());
  if (process.env.NODE_ENV === 'production') {
    app.use(cors({
      origin: process.env.BASE_URL as string,
      credentials: true
    }));
  }

  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "physiobit:",
  });

  app.use(session({
    secret: process.env.SESSION_SECRET as string, 
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    cookie: {
      secure: false,
      sameSite: false,
      httpOnly: true,
    }
  }));
  app.set('trust proxy', 1);
};
