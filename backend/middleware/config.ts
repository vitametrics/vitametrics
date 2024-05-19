import mongoose from 'mongoose';

import logger from './logger';
import initializeDB from './util/initializeDB';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    logger.info('Connected to database');
    await initializeDB();
    return connection;
  } catch (error: any) {
    logger.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };
