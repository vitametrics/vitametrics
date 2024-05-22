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

    const project = (await Project.findOne({
      projectId: req.query.projectId as string,
    })
      .select('-fitbitAccessToken -fitbitRefreshToken -lastTokenRefresh')
      .populate('members', 'userId email name role emailVerified')
      .populate('devices', 'deviceId deviceName deviceVersion')
      .populate('admins', 'userId')) as IProject;

    if (!project) {
      logger.error(`Project: ${req.query.projectId} not found`);
      res.status(404).json({ msg: 'Project not found' });
      return;
    }

    if (project.fitbitUserId) {
      isAccountLinked = true;
    }

    if (project.ownerId === currentUser.userId) {
      isOwner = true;
    }

    if (
      project.admins.some((admin) => {
        if (typeof admin === 'object' && 'userId' in admin) {
          return (admin as IUser).userId === currentUser.userId;
        }
        return false;
      })
    ) {
      isAdmin = true;
    }

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
        members: project.members,
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
    if (!currentProject.devices.includes(device._id as string)) {
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

    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      logger.error(
        `Fitbit account not linked to project: ${currentProject.projectId}`
      );
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }
    const devices = await fetchDevices(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      currentProject.projectId
    );

    logger.info(
      `Devices fetched successfully for project: ${currentProject.projectId}`
    );
    res.json(devices);
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
    const data = await fetchIntradayData(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      dataType as string,
      date as string,
      detailLevel as string
    );
    logger.info(
      `Intraday data fetched successfully for project: ${currentProject.projectId}`
    );
    res.json(data);
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
    const data = await fetchData(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      startDate as string,
      endDate as string
    );
    logger.info(
      `Data fetched successfully for project: ${currentProject.projectId}`
    );
    res.json(data);
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
