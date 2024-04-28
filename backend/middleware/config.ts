import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initDB from '../util/initializeDB';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
      .then(() => {
        console.log('Connected to database');
        initDB();
      })
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };
