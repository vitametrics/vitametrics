import express, { Request, Response } from 'express';

import crypto from 'crypto';
import { body } from 'express-validator';

import ProjectController from '../controllers/ProjectController';
import { validationHandler } from '../handlers/validationHandler';
import logger from '../middleware/logger';
import { sendEmail } from '../middleware/util/emailUtil';
import verifyRole from '../middleware/verifyRole';
import verifySession from '../middleware/verifySession';
import Project from '../models/Project';
import User from '../models/User';

const router = express.Router();

router.post(
  '/invite-admin',
  verifySession,
  verifyRole('siteOwner'),
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
        role: 'siteAdmin',
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
        logger.info(
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
// get all instance users
router.get(
  '/users',
  verifySession,
  verifyRole('siteOwner'),
  async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      logger.error(`Error fetching users: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

// get all instance projects
router.get(
  '/projects',
  verifySession,
  verifyRole('siteOwner'),
  async (req: Request, res: Response) => {
    try {
      const projects = await Project.find();
      return res.status(200).json(projects);
    } catch (error) {
      logger.error(`Error fetching projects: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

// edit specific user on instance
router.put(
  '/user/:id',
  verifySession,
  verifyRole('siteOwner'),
  validationHandler([
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('name').optional().isString().withMessage('Name is required'),
    body('role').optional().isString().withMessage('Role is required'),
  ]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

// edit specific project by id on instance
router.put(
  '/project/:id',
  verifySession,
  verifyRole('siteOwner'),
  validationHandler([
    body('projectName')
      .optional()
      .isString()
      .withMessage('Project name is required'),
    body('projectDescription')
      .optional()
      .isString()
      .withMessage('Project description is required'),
    body('ownerId').optional().isString().withMessage('Owner ID is required'),
  ]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedProject) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      return res.status(200).json(updatedProject);
    } catch (error) {
      logger.error(`Error updating project: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

// delete user by id on instance
router.delete(
  '/user/:id',
  verifySession,
  verifyRole('siteOwner'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      await User.findByIdAndDelete(id);

      res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

// delete project by id on instance
router.delete(
  '/project/:id',
  verifySession,
  verifyRole('siteOwner'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      await Project.findByIdAndDelete(id);

      return res.status(200).json({ msg: 'Project deleted successfully' });
    } catch (error) {
      logger.error(`Error deleting project: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

// unlink fitbit account from project
router.put(
  '/project/:id/unlink-fitbit',
  verifySession,
  verifyRole('siteOwner'),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      project.unlinkFitbitAccount(id);

      return res
        .status(200)
        .json({ msg: 'Fitbit account unlinked successfully' });
    } catch (error) {
      logger.error(`Error unlinking fitbit account: ${error}`);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
);

export default router;
