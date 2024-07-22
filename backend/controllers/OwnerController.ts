import { Request, Response } from 'express';

import crypto from 'crypto';
import { Types } from 'mongoose';

import logger from '../middleware/logger';
import { sendEmail } from '../middleware/util/emailUtil';
import Cache from '../models/Cache';
import Device from '../models/Device';
import FitbitAccount from '../models/FitbitAccount';
import Project from '../models/Project';
import User from '../models/User';

class OwnerController {
  static async inviteAdmin(req: Request, res: Response) {
    const { email, name } = req.body;
    try {
      logger.info(`Inviting admin with email: ${email} and name: ${name}`);

      const user = await User.findOne({ email: email });
      if (user) {
        res.status(400).json({ msg: 'User with that email already exists!' });
        return;
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
      res.status(200).json({ msg: 'User successfully invited' });
      return;
    } catch (error) {
      logger.error(`Error inviting admin: ${error}`);
      res.status(500).json({ msg: 'Internal server error' });
      return;
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      logger.info('Fetching all users');
      const users = await User.find();
      res.status(200).json(users);
      return;
    } catch (error) {
      logger.error(`Error fetching users: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async getSiteFitbitAccounts(req: Request, res: Response) {
    try {
      logger.info('Fetching all site fitbit accounts');

      const fitbitAccounts = await FitbitAccount.find().lean();

      const accountsWithProjectsAndDevices = await Promise.all(
        fitbitAccounts.map(async (account) => {
          const projects = await Project.find({
            fitbitAccounts: { $in: [account._id] },
          })
            .select('projectId projectName')
            .lean();

          const projectIds = projects.map((p) => p.projectId);

          const devices = await Device.find({
            fitbitUserId: account.userId,
            projectId: { $in: projectIds },
          })
            .select(
              'deviceId deviceName deviceVersion batteryLevel lastSyncTime projectId'
            )
            .lean();

          const devicesByProject = devices.reduce(
            (devAcc, device) => {
              if (!devAcc[device.projectId]) {
                devAcc[device.projectId] = [];
              }
              devAcc[device.projectId].push(device);
              return devAcc;
            },
            {} as { [key: string]: typeof devices }
          );

          return {
            userId: account.userId,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            lastTokenRefresh: account.lastTokenRefresh,
            projects: projects.map((project) => ({
              projectId: project.projectId,
              projectName: project.projectName,
              devices: devicesByProject[project.projectId] || [],
            })),
          };
        })
      );

      res.status(200).json(accountsWithProjectsAndDevices);
      return;
    } catch (error) {
      logger.error(`Error fetching fitbit accounts: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  static async deleteFitbitAccount(req: Request, res: Response) {
    const id = req.params.id;

    try {
      logger.info(`Deleting fitbit account: ${id}`);

      const fitbitAccount = await FitbitAccount.findOne({ fitbitUserId: id });
      if (!fitbitAccount) {
        res.status(404).json({ msg: 'Fitbit account not found' });
        return;
      }

      const projects = await Project.find({
        fitbitAccounts: { $in: [fitbitAccount._id] },
      });
      for (const project of projects) {
        project.fitbitAccounts = project.fitbitAccounts.filter(
          (objId) => !objId.equals(fitbitAccount._id as Types.ObjectId)
        );
        await project.save();
      }
      await Device.deleteMany({ fitbitUserId: id });
      await Cache.deleteMany({ fitbitUserId: id });

      await fitbitAccount.deleteOne();
      res.status(200).json({ msg: 'Fitbit account deleted successfully' });
      return;
    } catch (error) {
      logger.error(`Error deleting fitbit account: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async getSiteProjects(req: Request, res: Response) {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
      return;
    } catch (error) {
      logger.error(`Error fetching site projects: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async editSiteUser(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      logger.info(`Editing user: ${id}`);

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedUser) {
        res.status(404).json({ msg: 'User not found' });
        return;
      }

      res.status(200).json(updatedUser);
      return;
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async editSiteProject(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      logger.info(`Editing project: ${id}`);

      const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedProject) {
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      res.status(200).json(updatedProject);
      return;
    } catch (error) {
      logger.error(`Error updating project: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async deleteSiteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      logger.info(`Deleting user: ${id}`);

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        res.status(404).json({ msg: 'User not found' });
        return;
      }

      await user.deleteOne();

      res.status(200).json({ msg: 'User deleted successfully' });
      return;
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  static async deleteSiteProject(req: Request, res: Response) {
    const { id } = req.params;

    try {
      logger.info(`Deleting project: ${id}`);

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      await project.deleteOne();

      res.status(200).json({ msg: 'Project deleted successfully' });
      return;
    } catch (error) {
      logger.error(`Error deleting project: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async unlinkFitbitAccountFromProject(req: Request, res: Response) {
    const { id } = req.params;
    const projectId = req.body.projectId;

    try {
      logger.info(`Unlinking fitbit account: ${id} from project: ${projectId}`);

      const project = await Project.findOne({ projectId });
      if (!project) {
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      project.unlinkFitbitAccount(id);
      await Cache.deleteMany({ fitbitUserId: id, projectId });
      await Device.deleteMany({ fitbitUserId: id, projectId });

      res.status(200).json({ msg: 'Fitbit account unlinked successfully' });
      return;
    } catch (error) {
      logger.error(`Error unlinking fitbit account: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }
}

export default OwnerController;
