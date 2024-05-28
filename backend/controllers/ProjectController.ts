import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import { Types } from 'mongoose';

import logger from '../middleware/logger';
import fetchData from '../middleware/util/fetchData';
import fetchDevices from '../middleware/util/fetchDevices';
import fetchIntradayData from '../middleware/util/fetchIntraday';
import Cache from '../models/Cache';
import Device from '../models/Device';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';
import { DateTime } from 'luxon';
import { zip } from 'zip-a-folder';

const VALID_INTRADAY_INTERVALS = ['1sec', '1min', '5min', '15min'];

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
      .populate('devices', 'deviceId deviceName deviceVersion owner ownerName lastSyncTime batteryLevel')
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

export async function changeDeviceName(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { deviceId, deviceName } = req.body;

  try {
    logger.info(`Changing device name ${deviceId} to ${deviceName}`);

    const device = await Device.findOne({
      deviceId: deviceId,
      projectId: currentProject.projectId,
    });

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
    res
      .status(200)
      .json({ message: 'Device name changed successfully', device });
    return;
  } catch (error) {
    logger.error(`Error changing device name: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function removeDevice(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { deviceId } = req.body;

  try {
    logger.info(
      `Removing device: ${deviceId} from project: ${currentProject.projectId}`
    );

    const device = await Device.findOne({ deviceId: deviceId });
    if (!device) {
      logger.error(`Device: ${deviceId} not found`);
      res.status(404).json({ msg: 'Device not found' });
      return;
    }

    if (!currentProject.devices.includes(device._id as Types.ObjectId)) {
      logger.error(
        `Device: ${deviceId} not associated with project: ${currentProject.projectId}`
      );
      res.status(400).json({ msg: 'Device not associated with project' });
      return;
    }

    currentProject.devices = currentProject.devices.filter(
      (id) => !id.equals(device._id as Types.ObjectId)
    );

    await currentProject.save();

    await Device.findByIdAndDelete(device._id);

    await Cache.deleteMany({ projectId: currentProject.projectId, deviceId });

    logger.info(
      `Device: ${deviceId} removed successfully from project: ${currentProject.projectId}`
    );
    res.status(200).json({ msg: 'Device removed successfully' });
    return;
  } catch (error) {
    logger.error(`Error removing device: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function unlinkFitbitAccount(req: Request, res: Response) {
  const currentProject = req.project as IProject;

  try {

    logger.info(`Unlinking fitbit account for project: ${currentProject.projectId}`);

    const project = await Project.findOne({ projectId: currentProject.projectId });
    if (!project) {
      logger.error(`Project: ${currentProject.projectId} not found`);
      res.status(404).json({ msg: 'Project not found' });
      return;
    }

    const devices = await Device.find({ projectId: currentProject.projectId, owner: 'Project' });

    for (const device of devices) {
      await Cache.deleteMany({ deviceId: device.deviceId, projectID: currentProject.projectId });
      await device.deleteOne();
    }

    project.fitbitUserId = undefined;
    project.fitbitAccessToken = undefined;
    project.fitbitRefreshToken = undefined;
    project.lastTokenRefresh = undefined;

    await project.save();

    logger.info(`Fitbit account unlinked successfully for project: ${currentProject.projectId}`);
    res.status(200).json({ msg: 'Fitbit account unlinked successfully' });
    return;
  } catch (error) {
    logger.error(`Error unlinking Fitbit account: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function toggleNotifications(req: Request, res: Response) {
  const currentProject = req.project as IProject;

  try {
    logger.info(`Toggling notifications for project: ${currentProject.projectId}`);

    const project = await Project.findOne({ projectId: currentProject.projectId });

    if (!project) {
      logger.error(`Project: ${currentProject.projectId} not found`);
      res.status(404).json({ msg: 'Project not found' });
      return;
    }

    project.areNotificationsEnabled = !project.areNotificationsEnabled;

    await project.save();

    res.status(200).json({ msg: 'Notifications toggled successfully', areNotificationsEnabled: project.areNotificationsEnabled});

  } catch (error) {
    logger.error(`Error toggling notifications: ${error}`);
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

// export async function fetchDataHandler(req: Request, res: Response) {
//   const currentProject = req.project as IProject;
//   const { startDate, endDate } = req.query;
//   try {
//     logger.info(`Fetching data for project: ${currentProject.projectId}`);

//     if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
//       logger.error(
//         `Fitbit account not linked to project: ${currentProject.projectId}`
//       );
//       res.status(400).json({ message: 'Fitbit account not linked to project' });
//       return;
//     }
//     const projectFitbitUserId = currentProject.fitbitUserId;
//     const projectFitbitAccessToken = currentProject.fitbitAccessToken;

//     const projectData = await fetchData(
//       projectFitbitUserId,
//       projectFitbitAccessToken,
//       startDate as string,
//       endDate as string
//     );

//     const tempUsers = await User.find({
//       projects: currentProject._id,
//       isTempUser: true,
//     });

//     const tempUserData = await Promise.all(
//       tempUsers.map(async (tempUser) => {
//         if (!tempUser.fitbitUserId || !tempUser.fitbitAccessToken) {
//           logger.error(
//             `Fitbit account not linked to temporary user: ${tempUser.userId}`
//           );
//           return null;
//         }

//         return await fetchData(
//           tempUser.fitbitUserId,
//           tempUser.fitbitAccessToken,
//           startDate as string,
//           endDate as string
//         );
//       })
//     );

//     const allData = {
//       projectData,
//       tempUserData: tempUserData.filter((data) => data !== null),
//     };

//     logger.info(
//       `Data fetched successfully for project: ${currentProject.projectId}`
//     );
//     res.json(allData);
//     return;
//   } catch (error) {
//     logger.error(`Error fetching data: ${error}`);
//     res.status(500).json({ msg: 'Internal Server Error' });
//     return;
//   }
// }

export async function deleteCachedFiles(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { deviceId } = req.body;

  try {
    logger.info(
      `Deleting cached files for device: ${deviceId} in project: ${currentProject.projectId}`
    );

    const result = await Cache.deleteMany({
      projectId: currentProject.projectId,
      deviceId,
    });

    if (result.deletedCount === 0) {
      logger.warn(
        `No cached files for device: ${deviceId} in project: ${currentProject.projectId}`
      );
      res.status(404).json({ msg: 'No cached files found' });
      return;
    }

    logger.info(
      `Deleted ${result.deletedCount} cached files for device: ${deviceId} in project: ${currentProject.projectId}`
    );
    res.status(200).json({ msg: 'Cached files deleted successfully' });
    return;
  } catch (error) {
    logger.error(`Error deleting cached files: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function getCachedFiles(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { deviceId } = req.query;

  try {
    logger.info(
      `Retrieving cached files for project: ${currentProject.projectId}`
    );

    const query: { projectId: string; deviceId?: string } = {
      projectId: currentProject.projectId,
    };
    if (deviceId && typeof deviceId === 'string') {
      query['deviceId'] = deviceId;
    }

    const cachedFiles = await Cache.find(query);
    const cachedFileswithUrls = cachedFiles.map((file) => ({
      deviceId: file.deviceId,
      downloadUrl: `${process.env.API_URL}/project/cache/download/${file._id}`,
      createdAt: file.createdAt,
      key: file.key,
    }));

    res.status(200).json(cachedFileswithUrls);
    return;
  } catch (error) {
    logger.error(`Error retrieving cached files: ${error}`);
    return;
  }
}

export async function downloadCachedFile(req: Request, res: Response) {
  const cacheId = req.params.id;

  try {
    const cachedFile = await Cache.findById(cacheId);
    if (!cachedFile) {
      res.status(404).json({ msg: 'Cached file not found' });
      return;
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${cachedFile.key}.csv`
    );
    res.set('Content-Type', 'text/csv');
    res.send(cachedFile.data);
    return;
  } catch (error) {
    logger.error(`Error serving cached file: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function downloadDataHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const deviceIds = (req.query.deviceIds as string).split(',');
  const dataTypes = (req.query.dataTypes as string).split(',');
  const startDate = DateTime.fromFormat(req.query.startDate as string, 'MM/dd/yyyy').toISODate();
  const endDate = DateTime.fromFormat(req.query.endDate as string, 'MM/dd/yyyy').toISODate();
  const detailLevel = req.query.detailLevel as string;
  const archiveName = req.query.archiveName as string;

  if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
    res.status(400).json({ msg: 'Invalid or missing deviceIds' });
    return;
  }

  if (!dataTypes || !Array.isArray(dataTypes) || dataTypes.length === 0) {
    res.status(400).json({ msg: 'Invalid or missing dataTypes' });
    return;
  }

  if (!startDate || !endDate) {
    res.status(400).json({ msg: 'Start date and end date are required' });
    return;
  }

  try {
    logger.info(`Batch downloading data for project: ${currentProject.projectId}`);

    const dataToZip = [];
    const dateRange = getDateRange(startDate, endDate);
    const isIntraday = detailLevel && VALID_INTRADAY_INTERVALS.includes(detailLevel);

    for (const deviceId of deviceIds) {
      const aggregatedData: { [date: string]: { [dataType: string]: string } } = {};

      for (const date of dateRange) {
        const dailyData: { [timestamp: string]: { [dataType: string]: string } } = {};

        for (const dataType of dataTypes) {
          const cacheKey = `${currentProject.projectId}-${deviceId}-${dataType}-${date}-${detailLevel}`;
          let cachedData = await Cache.findOne({ key: cacheKey, projectId: currentProject.projectId, deviceId });

          if (!cachedData) {
            const device = await Device.findOne({ deviceId, projectId: currentProject.projectId });

            if (!device) {
              logger.error(`Device: ${deviceId} not found in project ${currentProject.projectId}`);
              res.status(404).json({ msg: 'Device not found' });
              return;
            }

            let data: any[] = [];
            let accessToken: string = '';
            let userId: string = '';

            if (device.owner === 'Project' && currentProject.fitbitAccessToken && currentProject.fitbitUserId) {
              accessToken = currentProject.fitbitAccessToken;
              userId = currentProject.fitbitUserId;
            } else {
              const user = await User.findOne({ userId: device.owner });
              if (user && user.isTempUser && user.fitbitAccessToken && user.fitbitUserId) {
                accessToken = user.fitbitAccessToken;
                userId = user.fitbitUserId;
              }
            }

            if (!accessToken || !userId) {
              logger.error(`Fitbit credentials not found for device owner: ${device.owner}`);
              res.status(400).json({ msg: 'Fitbit credentials not found for device owner'});
              return;
            }

            if (isIntraday) {
              data = await fetchIntradayData(userId, accessToken, dataType, date, detailLevel);
            } else {
              data = await fetchData(userId, accessToken, startDate, endDate, dataType);
            }

            const csvData = data.map((d) => `${d.timestamp || d.dateTime},${d.value}`).join('\n') + '\n';

            const newCache = new Cache({
              key: cacheKey,
              projectId: currentProject.projectId,
              deviceId,
              data: csvData,
              createdAt: new Date(),
            });

            await newCache.save();
            cachedData = newCache;
          }

          cachedData.data.split('\n').forEach((line) => {
            if (!line.trim()) return;
            const [timestamp, value] = line.split(',');
            if (!dailyData[timestamp]) {
              dailyData[timestamp] = {};
            }
            dailyData[timestamp][dataType] = value;
          });
        }

        if (isIntraday) {
          const headers = ['Timestamp', ...dataTypes].join(',');
          const rows = Object.keys(dailyData).sort().map((timestamp) => {
            const values = dataTypes.map((dataType) => dailyData[timestamp][dataType] || '');
            return [timestamp, ...values].join(',');
          });

          const csvContent = [headers, ...rows].join('\n');
          const fileName = `${currentProject.projectId}-${deviceId}-${date}.csv`;
          dataToZip.push({ fileName, data: csvContent });
        } else {
          Object.keys(dailyData).forEach((timestamp) => {
            const dateKey = timestamp.split('T')[0];
            if (!aggregatedData[dateKey]) {
              aggregatedData[dateKey] = {};
            }
            Object.assign(aggregatedData[dateKey], dailyData[timestamp]);
          });
        }
      }

      if (!isIntraday) {
        const headers = ['Date', ...dataTypes].join(',');
        const rows = Object.keys(aggregatedData).sort().map((date) => {
          const values = dataTypes.map((dataType) => aggregatedData[date][dataType] || '');
          return [date, ...values].join(',');
        });

        const csvContent = [headers, ...rows].join('\n');
        const singleFileName = `${archiveName || `${currentProject.projectId}-${deviceId}.csv`}`;
        res.setHeader('Content-Disposition', `attachment; filename=${singleFileName}`);
        res.set('Content-Type', 'text/csv');
        res.send(csvContent);
        return;
      }
    }

    if (isIntraday && dataToZip.length > 1) {
      const tempFolderPath = path.resolve(__dirname, `../tmp/${currentProject.projectId}-${Date.now()}`);
      fs.mkdirSync(tempFolderPath, { recursive: true });

      for (const { fileName, data } of dataToZip) {
        const filePath = path.join(tempFolderPath, fileName);
        fs.writeFileSync(filePath, data);
      }

      const zipFileName = `${archiveName || 'archive'}.zip`;
      const tempZipFolderPath = path.resolve(__dirname, '../tmp_zip');
      fs.mkdirSync(tempZipFolderPath, { recursive: true });
      const zipFilePath = path.join(tempZipFolderPath, zipFileName);

      await zip(tempFolderPath, zipFilePath);

      fs.rmSync(tempFolderPath, { recursive: true, force: true });

      res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
      res.sendFile(zipFilePath, (error) => {
        if (error) {
          logger.error(`Error sending zip file: ${error}`);
          res.status(500).json({ msg: 'Internal Server Error' });
          return;
        } else {
          fs.unlinkSync(zipFilePath);
        }
      });
    } else if (isIntraday && dataToZip.length === 1) {
      const singleFile = dataToZip[0];
      const singleFileName = `${archiveName || singleFile.fileName}`;
      res.setHeader('Content-Disposition', `attachment; filename=${singleFileName}`);
      res.set('Content-Type', 'text/csv');
      res.send(singleFile.data);
    }
  } catch (error) {
    logger.error(`Error downloading data: ${error}`);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

function getDateRange(startDate: string, endDate: string ): string[] {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  const range = [];

  for (let dt = start; dt <= end; dt = dt.plus({ days: 1})) {
    range.push(dt.toISODate()!);
  }

  return range;
}
