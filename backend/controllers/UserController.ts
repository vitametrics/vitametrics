import { Request, Response } from 'express';

import argon2, { verify } from 'argon2';
import crypto from 'crypto';
import { Types } from 'mongoose';

import logger from '../middleware/logger';
import { sendEmail } from '../middleware/util/emailUtil';
import Project from '../models/Project';
import User, { IUser } from '../models/User';

class UserController {
  static async authStatus(req: Request, res: Response) {
    const currentUser = req.user as IUser;

    if (req.isAuthenticated && req.isAuthenticated()) {
      try {
        logger.info(`User: ${currentUser.email} is authenticated`);
        const user = await User.findOne({ userId: currentUser.userId });
        if (!user) {
          logger.error(`User: ${currentUser.email} not found`);
          res.status(404).json({ msg: 'User not found' });
          return;
        }

        const projects = await Project.find({
          members: { $in: [user._id] },
        }).lean();

        const userProjects = projects.map((project) => ({
          projectId: project.projectId,
          projectName: project.projectName,
          memberCount: project.members.length,
          deviceCount: project.devices.length,
          isOwner: project.ownerId === user.userId,
          hasFitbitAccountLinked: project.fitbitAccessToken !== '',
        }));
        logger.info(`User: ${currentUser.email} fetched successfully`);
        res.json({
          isAuthenticated: true,
          user: {
            id: currentUser.userId,
            email: currentUser.email,
            role: currentUser.role,
            isEmailVerified: currentUser.emailVerified,
            projects: userProjects,
          },
        });
        return;
      } catch (error) {
        logger.error(`Error fetching user: ${error}`);
        res.status(500).json({ msg: 'Internal Server Error' });
        return;
      }
    } else {
      res.json({ isAuthenticated: false });
      return;
    }
  }

  static async checkPasswordToken(req: Request, res: Response) {
    const token = req.body.token as string;
    try {
      logger.info(`Checking password token: ${token}`);

      const user = await User.findOne({ setPasswordToken: token });
      if (!user) {
        logger.error(`Invalid token: ${token}`);
        res.status(500).json({ msg: 'Invalid token' });
        return;
      }
      logger.info(`Token is valid: ${token}`);
      res.status(200).json({ msg: 'Token is valid' });
      return;
    } catch (error) {
      logger.error(`Error checking password token: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async setPassword(req: Request, res: Response) {
    const { token, password } = req.body;
    const projectId = req.query.projectId as string;
    try {
      logger.info(`Setting password for token: ${token}`);

      const user = await User.findOne({ setPasswordToken: token });
      const project = await Project.findOne({ projectId });
      if (!user) {
        logger.error(`Invalid or expired token: ${token}`);
        res.status(400).json({ msg: 'Invalid or expired token' });
        return;
      }

      if ((!project && user.role === 'admin') || user.role === 'owner') {
        user.password = await argon2.hash(password);
        user.emailVerified = true;
        user.setPasswordToken = null;
        user.passwordTokenExpiry = null;
        await user.save();
        logger.info(`Password set successfully for admin/owner: ${user.email}`);
        res.status(200).json({
          msg: 'Password has been set successfully',
          email: user.email,
        });
        return;
      } else if (!project) {
        logger.error(`Project not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      user.password = await argon2.hash(password);
      user.emailVerified = true;
      user.setPasswordToken = null;
      user.passwordTokenExpiry = null;
      user.projects.push(project._id as Types.ObjectId);
      await user.save();

      project.members.push(user._id as Types.ObjectId);
      await project.save();

      logger.info(`Password set successfully for user: ${user.email}`);
      res
        .status(200)
        .json({ msg: 'Password set successfully', email: user.email });
      return;
    } catch (error) {
      logger.error(`Error setting password: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async changePassword(req: Request, res: Response) {
    const currentUser = req.user as IUser;
    const userId = currentUser.userId;
    const { password } = req.body;
    try {
      logger.info(`Changing password for user: ${currentUser.email}`);

      const user = await User.findOne({ userId });
      if (!user) {
        logger.error(`User: ${currentUser.email} not found`);
        res.status(404).json({ msg: 'User not found' });
        return;
      }
      user.password = await argon2.hash(password);
      await user.save();
      logger.info(
        `Password changed successfully for user: ${currentUser.email}`
      );
      res.status(200).json({ msg: 'Password changed successfully' });
      return;
    } catch (error) {
      logger.error(`Error changing password: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async changeEmail(req: Request, res: Response) {
    const currentUser = req.user as IUser;
    const userId = currentUser.userId;
    const { email } = req.body;
    try {
      logger.info(`Changing email for user: ${currentUser.email}`);

      const user = await User.findOne({ userId });
      if (!user) {
        logger.error(`User: ${currentUser.email} not found`);
        res.status(404).json({ msg: 'User not found' });
        return;
      }
      user.email = email;
      user.emailVerified = false;
      user.emailVerfToken = crypto.randomBytes(32).toString('hex');
      await user.save();
      const project = await Project.findOne({ ownerId: userId });
      if (project) {
        project.ownerEmail = email;
        await project.save();
      }
      logger.info(`Email changed successfully for user: ${currentUser.email}`);
      res.status(200).json({ msg: 'Email changed successfully' });
      return;
    } catch (error) {
      logger.error(`Error changing email: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async sendEmailVerification(req: Request, res: Response) {
    const currentUser = req.user as IUser;
    try {
      logger.info(`Sending email verification for user: ${currentUser.email}`);

      const user = await User.findOne({ email: currentUser.email });
      if (!user) {
        logger.error(`User: ${currentUser.email} not found`);
        res.status(404).json({ msg: 'User not found' });
        return;
      }
      const verificationLink = `https://${process.env.BASE_URL}/api/user/verify-email?token=${user.emailVerfToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Vitametrics Email Verification',
        text: `Please verify your email using this link ${verificationLink}`,
      });
      logger.info(
        `Email verification sent successfully for user: ${currentUser.email}`
      );
      res.status(200).json({ msg: 'Email sent successfully' });
      return;
    } catch (error) {
      logger.error(`Error sending email verification: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    const currentUser = req.user as IUser;
    try {
      logger.info(`Verifying email for user: ${currentUser.email}`);

      const user = await User.findOne({
        emailVerificationToken: req.query.token as string,
      });
      if (!user) {
        logger.error(`Invalid or expired verification token`);
        res.status(400).json({ msg: 'Invalid or expired verification token' });
        return;
      }
      if (
        !currentUser ||
        currentUser.id !== (user._id as Types.ObjectId).toString()
      ) {
        logger.error(`Unauthorized access`);
        res.redirect('/dashboard');
        return;
      }
      user.emailVerified = true;
      user.emailVerfToken = '';
      await user.save();
      logger.info(`Email verified successfully for user: ${currentUser.email}`);
      res.redirect('/dashboard?verified=true');
      return;
    } catch (error) {
      logger.error(`Error verifying email: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async deleteAccount(req: Request, res: Response) {
    const currentUser = req.user as IUser;
    const { password } = req.body;
    const userId = currentUser.userId;
    try {
      logger.info(`Deleting account for user: ${currentUser.email}`);

      const user = await User.findOne({ userId });
      if (!user) {
        logger.error(`User: ${currentUser.email} not found`);
        res.status(404).json({ msg: 'User not found' });
        return;
      }
      const passMatch = await verify(user.password, password);
      if (!passMatch) {
        logger.error(`Incorrect password`);
        res.status(401).json({ msg: 'Incorrect password' });
        return;
      }
      const project = await Project.findOne({ ownerId: userId });
      if (project) {
        logger.error(`Cannot delete account as owner of the project`);
        res
          .status(400)
          .json({ msg: 'Cannot delete account as owner of the project' });
        return;
      } else {
        await Project.updateOne(
          { members: user._id },
          { $pull: { members: user._id } }
        );
        await User.deleteOne({ userId });

        logger.info(
          `Account deleted successfully for user: ${currentUser.email}`
        );
        res.status(200).json({ msg: 'Account deleted' });
        return;
      }
    } catch (error) {
      logger.error(`Error deleting account: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }
}

export default UserController;
