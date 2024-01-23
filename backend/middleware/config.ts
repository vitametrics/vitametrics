import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const DB_URI = process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URI as string : process.env.DEV_DB_URI as string;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to database');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };