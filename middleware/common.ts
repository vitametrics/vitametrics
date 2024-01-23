import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const commonMiddlewares = (app: express.Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: "https://physiobit.seancornell.io",
    credentials: true
  }));
  app.set('trust proxy', 1);
};