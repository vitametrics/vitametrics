import { Request, Response } from 'express';

import { Types } from 'mongoose';

import logger from '../middleware/logger';
import fetchData from '../middleware/util/fetchData';
import fetchDevices from '../middleware/util/fetchDevices';
import fetchIntradayData from '../middleware/util/fetchIntraday';
import Device from '../models/Device';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';

export async function getProjectInfo(req: Request, res: Response) {
  try {
    const currentUser = req.user as IUser;

    logger.info(`Fetching project info with projectId: ${req.query.projectId}`);

    let isAccountLinked = false;
    let isAdmin = false;
    let isOwner = false;

    const project = await Project.findOne({
      projectId: req.query.projectId as string,
    })
      .select('-fitbitAccessToken -fitbitRefreshToken -lastTokenRefresh')
      .populate('members', 'userId email name role emailVerified isTempUser')
      .populate('devices', 'deviceId deviceName deviceVersion owner ownerName')
      .populate('admins', 'userId');

    if (!project) {
      logger.error(`Project: ${req.query.projectId} not found`);
      res.status(404).json({ msg: 'Project not found' });
      return;
    }

    if (project.fitbitUserId) {
      isAccountLinked = true;
    }

    const membersWithRole = project.members.map((member) => {
      const memberObj = member as unknown as IUser;
      const isOwner = project.ownerId === memberObj.userId;
      const isAdmin = project.admins.some((admin) => {
        const adminObj = admin as IUser & { _id: Types.ObjectId };
        return adminObj._id.equals(memberObj._id as Types.ObjectId);
      });
      return {
        ...memberObj.toObject(),
        isOwner,
        isAdmin,
      };
    });

    isAdmin = project.admins.some((admin) => {
      const adminObj = admin as IUser;
      return adminObj.userId === currentUser.userId;
    });

    isOwner = project.ownerId === currentUser.userId;

    logger.info(`Project info fetched successfully: ${project.projectId}`);
    res.cookie('projectId', project.projectId);
    res.json({
      project: {
        _id: project._id,
        projectId: project.projectId,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        ownerId: project.ownerId,
        ownerName: project.ownerName,
        ownerEmail: project.ownerEmail,
        members: membersWithRole,
        devices: project.devices,
        isAdmin,
        isOwner,
      },
      isAccountLinked,
    });
    return;
  } catch (error) {
    logger.error(`Error fetching project info: ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
}

export async function removeMember(req: Request, res: Response) {
  const { userId } = req.body;
  const project = req.project as IProject;
  try {
    logger.info(
      `Removing member: ${userId} from project: ${project.projectId}`
    );

    const userToRemove = await User.findOne({ userId });
    if (!userToRemove) {
      logger.error(`User: ${userId} not found`);
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    // make sure user is associated with project
    if (!project.members.includes(userToRemove._id as Types.ObjectId)) {
      logger.error(
        `User: ${userId} not associated with project: ${project.projectId}`
      );
      res.status(400).json({ msg: 'User not associated with project' });
      return;
    }

    if (project.ownerId === userToRemove.userId) {
      logger.error(`Cannot remove owner from project`);
      res.status(400).json({ msg: 'Cannot remove owner from project' });
      return;
    }

    await project.updateOne({ $pull: { members: userToRemove._id } });
    await userToRemove.deleteOne();
    logger.info(
      `Member: ${userId} removed successfully from project: ${project.projectId}`
    );
    res.status(200).json({ message: 'Member removed successfully' });
    return;
  } catch (error) {
    logger.error(`Error removing member: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function changeDeviceName(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { deviceId, deviceName } = req.body;

  try {
    logger.info(`Changing device name ${deviceId} to ${deviceName}`);

    const device = await Device.findOne({ deviceId });

    if (!device) {
      logger.error(`Device: ${deviceId} not found`);
      res.status(404).json({ msg: 'Device not found' });
      return;
    }

    // make sure device is associated with project
    if (!currentProject.devices.includes(device._id as Types.ObjectId)) {
      logger.error(
        `Device: ${deviceId} not associated with project: ${currentProject.projectId}`
      );
      res.status(400).json({ msg: 'Device not associated with project' });
      return;
    }

    device.deviceName = deviceName;

    await device.save();

    logger.info(`Device name changed successfully: ${deviceId}`);
    res.status(200).json({ message: 'Device name changed successfully' });
    return;
  } catch (error) {
    logger.error(`Error changing device name: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function changeMemberName(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { userId, name } = req.body;

  try {
    logger.info(`Changing member name ${userId} to ${name}`);

    const user = await User.findOne({ userId });

    if (!user) {
      logger.error(`User: ${userId} not found`);
      res.status(404).json({ msg: 'User not found' });
      return;
    } else if (!currentProject.members.includes(user._id as Types.ObjectId)) {
      // make sure user is associated with project
      logger.error(
        `User: ${userId} not associated with project: ${currentProject.projectId}`
      );
      res.status(400).json({ msg: 'User not associated with project' });
      return;
    }

    user.name = name;
    await user.save();
    logger.info(`Member name changed successfully: ${userId}`);
    res.status(200).json({ message: 'Member name changed successfully' });
    return;
  } catch (error) {
    logger.error(`Error changing member name: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function fetchDevicesHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;

  try {
    logger.info(`Fetching devices for project: ${currentProject.projectId}`);

    const devicesForProject = [];

    if (currentProject.fitbitUserId && currentProject.fitbitAccessToken) {
      const projectDevices = await fetchDevices(
        currentProject.fitbitUserId,
        currentProject.fitbitAccessToken,
        currentProject.projectId,
        { id: 'Project', name: 'Project' }
      );
      devicesForProject.push(...projectDevices);
    }

    const tempUsers = await User.find({
      _id: { $in: currentProject.members },
      isTempUser: true,
      fitbitUserId: { $exists: true, $ne: null },
      fitbitAccessToken: { $exists: true, $ne: null },
    });

    for (const tempUser of tempUsers) {
      const userDevice = await fetchDevices(
        tempUser.fitbitUserId!,
        tempUser.fitbitAccessToken!,
        currentProject.projectId,
        { id: tempUser.userId, name: tempUser.name }
      );
      devicesForProject.push(...userDevice);
    }

    logger.info(
      `Devices fetched successfully for project: ${currentProject.projectId}`
    );
    res.status(200).json(devicesForProject);
    return;
  } catch (error) {
    logger.error(`Error fetching devices: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function fetchIntradayDataHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  try {
    logger.info(
      `Fetching intraday data for project: ${currentProject.projectId}`
    );

    const { dataType, date, detailLevel } = req.query;
    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      logger.error(
        `Fitbit account not linked to project: ${currentProject.projectId}`
      );
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }

    const projectFitbitUserId = currentProject.fitbitUserId;
    const projectFitbitAccessToken = currentProject.fitbitAccessToken;

    const projectData = await fetchIntradayData(
      projectFitbitUserId,
      projectFitbitAccessToken,
      dataType as string,
      date as string,
      detailLevel as string
    );

    const tempUsers = await User.find({
      projects: currentProject._id,
      isTempUser: true,
    });

    const tempUserData = await Promise.all(
      tempUsers.map(async (tempUser) => {
        if (!tempUser.fitbitUserId || !tempUser.fitbitAccessToken) {
          logger.error(
            `Fitbit account not linked to temporary user: ${tempUser.userId}`
          );
          return null;
        }

        return await fetchIntradayData(
          tempUser.fitbitUserId,
          tempUser.fitbitAccessToken,
          dataType as string,
          date as string,
          detailLevel as string
        );
      })
    );

    const allData = {
      projectData,
      tempUserData: tempUserData.filter((data) => data !== null),
    };

    logger.info(
      `Intraday data fetched successfully for project: ${currentProject.projectId}`
    );
    res.json(allData);
    return;
  } catch (error) {
    logger.error(`Error fetching intraday data: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function fetchDataHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { startDate, endDate } = req.query;
  try {
    logger.info(`Fetching data for project: ${currentProject.projectId}`);

    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      logger.error(
        `Fitbit account not linked to project: ${currentProject.projectId}`
      );
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }
    const projectFitbitUserId = currentProject.fitbitUserId;
    const projectFitbitAccessToken = currentProject.fitbitAccessToken;

    const projectData = await fetchData(
      projectFitbitUserId,
      projectFitbitAccessToken,
      startDate as string,
      endDate as string
    );

    const tempUsers = await User.find({
      projects: currentProject._id,
      isTempUser: true,
    });

    const tempUserData = await Promise.all(
      tempUsers.map(async (tempUser) => {
        if (!tempUser.fitbitUserId || !tempUser.fitbitAccessToken) {
          logger.error(
            `Fitbit account not linked to temporary user: ${tempUser.userId}`
          );
          return null;
        }

        return await fetchData(
          tempUser.fitbitUserId,
          tempUser.fitbitAccessToken,
          startDate as string,
          endDate as string
        );
      })
    );

    const allData = {
      projectData,
      tempUserData: tempUserData.filter((data) => data !== null),
    };

    logger.info(
      `Data fetched successfully for project: ${currentProject.projectId}`
    );
    res.json(allData);
    return;
  } catch (error) {
    logger.error(`Error fetching data: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function downloadDataHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { deviceId, dataType, date, detailLevel } = req.query;
  try {
    logger.info(`Downloading data for project: ${currentProject.projectId}`);

    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      logger.error(
        `Fitbit account not linked to project: ${currentProject.projectId}`
      );
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }
    const data = await fetchIntradayData(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      dataType as string,
      date as string,
      detailLevel as string
    );
    const csv = data.map((d) => `${d.timestamp},${d.value}`).join('\n') + '\n';
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${deviceId}-${date}-${detailLevel}.csv"`
    );
    res.set('Content-Type', 'text/csv');
    logger.info(
      `Data downloaded successfully for project: ${currentProject.projectId}`
    );
    res.send(csv);
    return;
  } catch (error) {
    logger.error(`Error downloading data: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}
