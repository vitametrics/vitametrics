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

      const existingProject = await Project.findOne({
        projectName,
        ownerId: user.userId,
      });
      if (existingProject) {
        logger.error(
          `User already has a project with the name: ${projectName}`
        );
        res
          .status(409)
          .json({ msg: 'You already have a project with this name!' });
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
        res
          .status(200)
          .json({ msg: 'Project created successfully', savedProject });
        return;
      } else {
        const projectResponse = {
          projectId: savedProject.projectId,
          projectName: savedProject.projectName,
          memberCount: savedProject.members.length,
          deviceCount: savedProject.devices ? savedProject.devices.length : 0,
        };

        logger.info(`Project created successfully: ${projectResponse}`);
        res.status(200).json({
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
    const projectId =
      (req.body.projectId as string) || (req.query.projectId as string);

    try {
      logger.info(
        `User: ${currentUser.email} attempting to delete project: ${projectId}`
      );

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      if (
        currentUser.role !== 'siteAdmin' &&
        currentUser.role !== 'siteOwner' &&
        project.ownerId !== currentUser.userId &&
        !project.admins.includes(currentUser._id as Types.ObjectId)
      ) {
        logger.error(
          `User: ${currentUser.email} does not have permission to delete project: ${projectId}`
        );
        res
          .status(403)
          .json({ msg: 'You do not have permission to delete this project' });
        return;
      }

      const members = project.members;
      const deviceIds = project.devices;

      if (deviceIds && deviceIds.length > 0) {
        await Device.deleteMany({ deviceId: { $in: deviceIds } });
      }

      if (members && members.length > 0) {
        for (const member of members) {
          await User.updateOne(
            { _id: member._id },
            { $pull: { projects: project._id } }
          );
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

  static async getAvailableUsers(req: Request, res: Response) {
    const projectId = req.cookies.projectId as string;

    try {
      const project = await Project.findOne({ projectId });
      if (!project) {
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      const existingMemberIds = project.members.map((member) =>
        member.toString()
      );

      const availableUsers = await User.find({
        _id: { $nin: existingMemberIds },
      }).select('email name isTempUser');

      res.status(200).json({ availableUsers });
      return;
    } catch (error) {
      logger.error(`Error getting available users: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async addMember(req: Request, res: Response) {
    const { email, name, role } = req.body;
    const projectId = req.body.projectId as string;

    try {
      logger.info(`Adding member: ${email} to project: ${projectId}`);

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      const user = await User.findOne({ email });

      const newUserId = crypto.randomBytes(16).toString('hex');
      const passwordToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000);

      if (!user) {
        if (role === 'tempUser') {
          const tempUser = new User({
            userId: newUserId,
            email,
            name,
            role: 'user',
            isTempUser: true,
            projects: [project._id],
          });

          await tempUser.save();
          project.members.push(tempUser._id as Types.ObjectId);
          await project.save();

          const fitbitAuthLink = `${process.env.API_URL}/auth?userId=${newUserId}&projectId=${project.projectId}`;
          if (process.env.NODE_ENV === 'production') {
            await sendEmail({
              to: email,
              subject: `Vitametrics: Invitation to Participate`,
              text: `Please associate your account with Fitbit by following this link: ${fitbitAuthLink}`,
            });
            await sendEmail({
              to: project.ownerEmail,
              subject: `[INFO] Vitametrics: ${project.projectName} - New Member Added`,
              text: `A new member has been added to your project by ${req.user?.name}.\nThe users role is set to 'tempUser'.\n\nYou can manage your project using this link: ${process.env.BASE_URL}/dashboard/project?id=${project.projectId}`,
            });
            res
              .status(200)
              .json({ msg: 'Temp member added successfully', project });
            return;
          } else {
            logger.info(
              `Temporary user invited to join project: ${project.projectName}. They can set link their Fitbit account by following this link: ${fitbitAuthLink}`
            );
            res
              .status(200)
              .json({ msg: 'Temp member added successfully', project });
            return;
          }
        } else {
          const newUser = new User({
            userId: newUserId,
            email: email,
            name: name,
            role: 'user',
            setPasswordToken: passwordToken,
            passwordTokenExpiry: tokenExpiry,
          });

          await newUser.save();

          if (process.env.NODE_ENV === 'production') {
            await sendEmail({
              to: email,
              subject: 'Vitametrics: Invitation to Join',
              text: `You have been invited to join the project: ${project.projectName}. Please set your password by following this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}&projectId=${project.projectId}`,
            });
            await sendEmail({
              to: project.ownerEmail,
              subject: `[INFO] Vitametrics: ${project.projectName} - New Member Added`,
              text: `A new member has been added to your project by ${req.user?.name}.\nThe users role is set to 'user'.\nTo manage your project, use this link: ${process.env.BASE_URL}/dashboard/project?id=${project.projectId}&view=overview`,
            });
            res.status(200).json({ msg: 'Member invited successfully' });
            return;
          } else {
            logger.info(
              `User: ${email} invited to join project: ${project.projectName}. They can set their password by following this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}&projectId=${project.projectId}`
            );
            res.status(200).json({ msg: 'Member invited successfully' });
            return;
          }
        }
      } else {
        if (project.members.includes(user._id as Types.ObjectId)) {
          logger.error(
            `User: ${email} is already a member of project: ${project.projectName}`
          );
          res
            .status(409)
            .json({ msg: 'User is already a member of the project' });
          return;
        } else {
          user.projects.push(project._id as Types.ObjectId);

          await user.save();

          project.members.push(user._id as Types.ObjectId);
          if (role === 'admin') {
            project.admins.push(user._id as Types.ObjectId);

            await project.save();

            if (process.env.NODE_ENV === 'production') {
              await sendEmail({
                to: user.email,
                subject: `Vitametrics: Admin Invitation to ${project.projectName}`,
                text: `You have been invited to join ${project.projectName} as an admin. You can access the project using this link: ${process.env.BASE_URL}/dashboard/project?id=${project.projectId}&view=overview`,
              });
              await sendEmail({
                to: project.ownerEmail,
                subject: `[INFO] Vitametrics: Admin Added to ${project.projectName}`,
                text: `A new admin has been added to your project by ${req.user?.name}.\n\nYou can manage your project using this link: ${process.env.BASE_URL}/dashboard/project?id=${project.projectId}`,
              });
              res.status(200).json({ msg: 'Admin added successfully' });
              return;
            } else {
              logger.info(
                `User: ${user.email} added as an admin to project: ${project.projectName}`
              );
              res.status(200).json({ msg: 'Admin added successfully' });
              return;
            }
          }

          await project.save();

          if (process.env.NODE_ENV === 'production') {
            if (role !== 'tempUser') {
              await sendEmail({
                to: user.email,
                subject: `Vitametrics: Invitation to ${project.projectName}`,
                text: `You have been added to the project: ${project.projectName} with the role ${role as string | 'user'}. You can access the project using this link: ${process.env.BASE_URL}/dashboard/project?id=${project.projectId}&view=overview`,
              });
            }
            await sendEmail({
              to: project.ownerEmail,
              subject: `[INFO] Vitametrics: ${project.projectName} - Member Added`,
              text: `A new member has been added to your project by ${req.user?.name}.\n\nYou can manage your project using this link: ${process.env.BASE_URL}/dashboard/project?id=${project.projectId}`,
            });
            res.status(200).json({ msg: 'Member added successfully' });
            return;
          } else {
            logger.info(
              `User: ${user.email} added to project: ${project.projectName}`
            );
            res.status(200).json({ msg: 'Member added successfully' });
            return;
          }
        }
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
        .populate('admins', 'userId')
        .populate('devices', 'owner');
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

      const user = await User.findOne({ userId });
      if (!user) {
        logger.error(`User: ${userId} not found`);
        res.status(404).json({ msg: 'User not found' });
        return;
      }

      if (user.isTempUser) {
        console.log('was temp user')
        const userDevices = project.devices.filter((device: any) => device.owner === user.userId );
        const deviceIdsToRemove = userDevices.map((device: any) => device._id);

        console.log(userDevices);
        console.log(deviceIdsToRemove);

        project.devices = project.devices.filter((device: any) => !deviceIdsToRemove.includes(device._id));
        await Device.deleteMany({ _id: { $in: deviceIdsToRemove }});
      }

      project.members = updatedMembers;
      project.admins = updatedAdmins;

      await project.save();

      user.projects = user.projects.filter(
        (pid) => !pid.equals(project._id as Types.ObjectId)
      );
      await user.save();

      if (process.env.NODE_ENV === 'production') {
        if (!user.isTempUser) {
          await sendEmail({
            to: user.email,
            subject: 'Removal from project',
            text: `You have been removed from the project: ${project.projectName}.`,
          });
        }
        await sendEmail({
          to: project.ownerEmail,
          subject: `[INFO] ${project.projectName} - Member Removed`,
          text: `A member has been removed from your project by ${req.user?.name}.\n\nYou can manage your project using this link: ${process.env.BASE_URL}/dashboard/project?id=${project.projectId}`,
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
    const currentUser = req.user as IUser;
    const newProjectName = req.body.newProjectName as string;
    const projectId = req.body.projectId as string;

    try {
      logger.info(
        `[${currentUser.name}, ${currentUser.id}] Changing project name to: ${newProjectName} for project: ${projectId}`
      );

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      const existingProject = await Project.findOne({
        projectName: newProjectName,
        ownerId: currentUser.userId,
      });
      if (existingProject && existingProject._id !== project._id) {
        logger.error(
          `User already has a project with the name: ${newProjectName}`
        );
        res
          .status(409)
          .json({ msg: 'You already have a project with this name' });
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
    const currentUser = req.user as IUser;
    const newProjectDescription = req.body.newProjectDescription as string;
    const projectId = req.body.projectId as string;

    try {
      logger.info(
        `[${currentUser.name}, ${currentUser.id}] Changing project description to: ${newProjectDescription} for project: ${projectId}`
      );

      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(`Project: ${projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      project.projectDescription = newProjectDescription;
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
