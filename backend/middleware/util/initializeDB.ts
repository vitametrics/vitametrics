import crypto from 'crypto';

import { sendEmail } from './emailUtil';
import logger from '../logger';
import Setting from '../../models/Setting';
import User from '../../models/User';

async function initializeDatabase() {
  logger.info('Initializing the database');

  try {
    const isInitialized = await Setting.findOne({ type: 'initialized' });
    if (!isInitialized === true && process.env.ADMIN_EMAIL) {
      const newUserId = crypto.randomBytes(16).toString('hex');
      const newOrgId = crypto.randomBytes(16).toString('hex');
      const passwordToken = crypto.randomBytes(32).toString('hex');

      const newUser = new User({
        userId: newUserId,
        email: process.env.ADMIN_EMAIL,
        role: 'owner',
        name: 'Owner',
        emailVerfToken: crypto.randomBytes(32).toString('hex'),
        emailVerified: false,
        orgId: newOrgId,
        setPasswordToken: passwordToken,
        languageLocale: 'en-US',
        distanceUnit: 'en-US',
      });

      await newUser.save();

      if (process.env.NODE_ENV === 'production') {
        await sendEmail({
          to: process.env.ADMIN_EMAIL as string,
          subject: 'Your New Account',
          text: `An account has been created for you. Please login using this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}`,
        });
      } else {
        logger.info(`Account created for ${process.env.ADMIN_EMAIL}. Password reset link: ${process.env.BASE_URL}/set-password?token=${passwordToken}`)
      }

      await Setting.create({ type: 'initialized', value: true });

      logger.info('Default user has been created');
    } else {
      logger.info('Database already initialized');
    }
  } catch (error) {
    logger.error(`Failed to initialize database: ${error}`);
  }
}

export default initializeDatabase;
