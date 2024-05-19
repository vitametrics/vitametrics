import express, { Request, Response } from 'express';

import crypto from 'crypto';
import { body } from 'express-validator';

import { validationHandler } from '../handlers/validationHandler';
import logger from '../middleware/logger';
import { sendEmail } from '../middleware/util/emailUtil';
import verifyRole from '../middleware/verifyRole';
import verifySession from '../middleware/verifySession';
import User from '../models/User';

const router = express.Router();

router.post(
  '/invite-admin',
  verifySession,
  verifyRole('owner'),
  validationHandler([
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').isString().withMessage('Name is required'),
  ]),
  async (req: Request, res: Response) => {
    logger.info('Inviting admin');

    if (!req.user) {
      logger.error('User not logged in');
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const { email, name } = req.body;

    try {
      const user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ msg: 'User with that email already exists!' });
      }

      const passwordToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      const newUserId = crypto.randomBytes(16).toString('hex');

      const newUser = new User({
        userId: newUserId,
        email: email,
        role: 'admin',
        name: name,
        setPasswordToken: passwordToken,
        passwordTokenExpiry: tokenExpiry,
      });

      await newUser.save();

      if (process.env.NODE_ENV === 'production') {
        await sendEmail({
          to: email,
          subject: 'You have been invited as an admin',
          text: `An account has been created for you. Please login using this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}`,
        });
      } else {
        console.log(
          `[INFO] An account has been created for you. Please login using this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}`
        );
      }
      logger.info(`User invited as admin: ${newUser.email}, ${newUser.name}`);
      return res.status(200).json({ msg: 'User successfully invited' });
    } catch (error) {
      logger.error(`Error inviting admin: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

export default router;
