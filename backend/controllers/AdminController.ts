import { Request, Response } from 'express';

import crypto from 'crypto';
import fs from 'fs';
import moment from 'moment';
import { Types } from 'mongoose';
import path from 'path';

import logger from '../middleware/logger';
import { sendEmail } from '../middleware/util/emailUtil';
import Device from '../models/Device';
import Project from '../models/Project';
import User, { IUser } from '../models/User';

interface IPopulatedUser {
  _id: Types.ObjectId;
  userId: string;
}
class AdminController {
  static async createProject(req: Request, res: Response) {
    const projectName = req.body.projectName as string;
    const projectDescription = req.body.projectDescription as string;
    const user = req.user as IUser;

    try {
      logger.info(
        `Creating project with name: ${projectName} by user: ${user.email}`
      );

      const existingProject = await Project.findOne({ projectName });
      if (existingProject) {
        logger.error(`Project with name: ${projectName} already exists`);
        res.status(409).json({ msg: 'Project with that name already exists!' });
        return;
      }

      const newProjectId = crypto.randomBytes(16).toString('hex');

      const newProject = new Project({
        projectName,
        projectId: newProjectId,
        ownerId: user.userId,
        ownerName: user.name,
        ownerEmail: user.email,
        members: [user._id],
      });

      if (projectDescription) {
        newProject.projectDescription = projectDescription;
      }

      const savedProject = await newProject.save();

      user.projects.push(savedProject._id as Types.ObjectId);

      await user.save();

      if (process.env.NODE_ENV === 'production') {
        logger.info(
          `Sending email to user: email: ${user.email}, link: ${process.env.BASE_URL}/dashboard/project?id=${newProjectId}`
        );
        await sendEmail({
          to: user.email,
          subject: 'Your new project',
          text: `You have created a new project: ${projectName}. Access it here: ${process.env.BASE_URL}/dashboard/project?id=${newProjectId}`,
        });
      } else {
        const projectResponse = {
          projectId: savedProject.projectId,
          projectName: savedProject.projectName,
          memberCount: savedProject.members.length,
          deviceCount: savedProject.devices ? savedProject.devices.length : 0,
        };

        logger.info(`Project created successfully: ${projectResponse}`);
        res.status(201).json({
          msg: 'Project created successfully',
          project: projectResponse,
        });
        return;
      }
    } catch (error) {
      logger.error(`Error creating project ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async deleteProject(req: Request, res: Response) {
    const currentUser = req.user as IUser;
    const projectId = req.body.projectId;
    const userId = currentUser.userId;

    try {
      logger.info(
        `User: ${currentUser.email} attempting to delete project: ${projectId}`
      );

      const user = await User.findOne({ userId });
      if (!user) {
        res.status(404).json({ msg: 'User not found' });
        return;
      }

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      const members = project.members;
      const deviceIds = project.devices;

      if (deviceIds && deviceIds.length > 0) {
        await Device.deleteMany({ deviceId: { $in: deviceIds } });
      }

      if (members && members.length > 1) {
        for (const member of members) {
          if (member._id != user._id) {
            await User.deleteOne({ _id: member });
          }
        }
      }

      await Project.findOneAndDelete({ projectId });
      logger.info(
        `Project: ${projectId} deleted successfully by user: ${currentUser.email}`
      );
      res.status(200).json({ msg: 'Project deleted successfully' });
      return;
    } catch (error) {
      logger.error(`Error deleting project: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async addMember(req: Request, res: Response) {
    const { email, name, role } = req.body;
    const projectId =
      (req.query.projectId as string) || (req.body.projectId as string);

    try {
      logger.info(`Adding member: ${email} to project: ${projectId}`);

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      let user = await User.findOne({ email });

      const newUserId = crypto.randomBytes(16).toString('hex');
      const passwordToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000);

      if (!user) {
        const newUser = new User({
          userId: newUserId,
          email: email,
          name: name,
          role: 'user',
          setPasswordToken: passwordToken,
          passwordTokenExpiry: tokenExpiry,
        });

        user = newUser;
        await newUser.save();

        console.log(role);
        if (role === 'admin') {
          project.admins.push(newUser._id as Types.ObjectId);
          await project.save();
        }
      }

      if (process.env.NODE_ENV === 'production') {
        await sendEmail({
          to: email,
          subject: 'Invitation to join a project',
          text: `You have been invited to join the project: ${project.projectName}. Please set your password by following this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}&projectId=${project.projectId}`,
        });
        res.status(200).json({ msg: 'Member added successfully', project });
        return;
      } else {
        logger.info(
          `User invited to join project: ${project.projectName}. They can set their password by following this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}&projectId=${project.projectId}`
        );
      }
    } catch (error) {
      logger.error(`Error adding member: ${error}`);
      res.status(500).json({ msg: 'Internal server error' });
      return;
    }
  }

  static async removeMember(req: Request, res: Response) {
    const userId = req.body.userId as string;
    const projectId =
      (req.query.projectId as string) || (req.body.projectId as string);

    try {
      logger.info(`Removing member: ${userId} from project: ${projectId}`);

      const project = await Project.findOne({ projectId })
        .populate('members', 'userId')
        .populate('admins', 'userId');
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      if (project.ownerId === userId) {
        logger.error('Cannot remove project owner');
        res.status(400).json({ msg: 'Cannot remove project owner' });
        return;
      }

      const members = project.members as unknown as IPopulatedUser[];
      const admins = project.admins as unknown as IPopulatedUser[];

      const updatedMembers = members
        .filter((member) => member.userId !== userId)
        .map((member) => member._id);

      const updatedAdmins = admins
        .filter((admin) => admin.userId !== userId)
        .map((admin) => admin._id);

      project.members = updatedMembers;
      project.admins = updatedAdmins;

      await project.save();

      const user = await User.findOne({ userId });
      if (!user) {
        logger.error(`User: ${userId} not found`);
        res.status(404).json({ msg: 'User not found' });
        return;
      }

      user.projects = user.projects.filter(
        (pid) => !pid.equals(project._id as Types.ObjectId)
      );
      await user.save();

      if (process.env.NODE_ENV === 'production') {
        await sendEmail({
          to: user.email,
          subject: 'Removal from project',
          text: `You have been removed from the project: ${project.projectName}.`,
        });
        res.status(200).json({ msg: 'Member removed successfully' });
        return;
      } else {
        logger.info(
          `User ${user.name} removed from project: ${project.projectName}`
        );
        res.status(200).json({ msg: 'Member removed successfully' });
        return;
      }
    } catch (error) {
      logger.error(`Error removing member: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async changeProjectOwnerEmail(req: Request, res: Response) {
    const newOwnerEmail = req.body.newOwnerEmail as string;
    const projectId = req.body.projectId as string;

    try {
      logger.info(
        `Changing project owner email to: ${newOwnerEmail} for project: ${projectId}`
      );

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      project.ownerEmail = newOwnerEmail;
      await project.save();
      res.status(200).json({ msg: 'Project owner email changed successfully' });
      return;
    } catch (error) {
      logger.error(`Error changing project owner email: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async changeProjectName(req: Request, res: Response) {
    const newProjectName = req.body.newProjectName as string;
    const projectId = req.body.projectId as string;

    try {
      logger.info(
        `Changing project name to: ${newProjectName} for project: ${projectId}`
      );

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      project.projectName = newProjectName;
      await project.save();
      res.status(200).json({ msg: 'Project name changed successfully' });
      return;
    } catch (error) {
      logger.error(`Error changing project name: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async changeProjectDescription(req: Request, res: Response) {
    const newProjectDescription = req.body.newProjectDescription as string;
    const projectId = req.body.projectId as string;

    try {
      logger.info(
        `Changing project description to: ${newProjectDescription} for project: ${projectId}`
      );

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      project.projectName = newProjectDescription;
      await project.save();
      res.status(200).json({ msg: 'Project description changed successfully' });
      return;
    } catch (error) {
      logger.error(`Error changing project description: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async downloadLog(req: Request, res: Response) {
    const currentDate = moment().format('YYYY-MM-DD');
    const logType = req.body.logType as string;
    let logFileName = '';

    if (logType === 'info') {
      logFileName = `${currentDate}-vitametrics.log`;
    } else if (logType === 'error') {
      logFileName = `${currentDate}-error.log`;
    } else {
      logger.error(`Incorrect log type provided: ${logType}`);
      res.status(500).json({ msg: 'Incorrect log' });
      return;
    }

    const logFilePath = path.join(__dirname, '..', 'logs', logFileName);

    if (!fs.existsSync(logFilePath)) {
      logger.error('Log file not found');
      res.status(404).json({ msg: 'Log file not found' });
      return;
    }

    res.download(logFilePath, logFileName, (error) => {
      if (error) {
        logger.error(`Error downloading log file: ${error}`);
        res.status(500).json({ msg: 'Error downloading log file' });
        return;
      }
    });
  }
}

export default AdminController;
