import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initDB from './util/initializeDB';

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to database');
    await initDB();
    return connection;
  } catch (error: any) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };
