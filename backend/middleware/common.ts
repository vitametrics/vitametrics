import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const commonMiddlewares = (app: express.Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.BASE_URL as string,
    credentials: true
  }));
  app.set('trust proxy', 1);
};