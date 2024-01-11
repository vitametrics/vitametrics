import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';

import UserRouter from './routes/UserRouter';

dotenv.config();

const app: Express = express();

const DB_URI: string = process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URI as string : process.env.DEV_DB_URI as string;

mongoose.connect(DB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use('/user', UserRouter);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})

