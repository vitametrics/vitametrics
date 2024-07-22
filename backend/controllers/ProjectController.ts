import { Request, Response } from 'express';

import fs from 'fs';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';
import path from 'path';
import { zip } from 'zip-a-folder';

import getDateRange from '../middleware/getDateRange';
import logger from '../middleware/logger';
import fetchData from '../middleware/util/fetchData';
import fetchDevices from '../middleware/util/fetchDevices';
import fetchIntradayData from '../middleware/util/fetchIntraday';
import Cache from '../models/Cache';
import Device from '../models/Device';
import FitbitAccount from '../models/FitbitAccount';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';
import generateCSV from '../middleware/generateCSV';

const VALID_INTRADAY_INTERVALS = ['1sec', '1min', '5min', '15min'];
class ProjectController {
  static async getProjectInfo(req: Request, res: Response) {
    try {
      const currentUser = req.user as IUser;
      const projectId = req.query.projectId as string;

      const project = await Project.findOne({ projectId })
        .select('-fitbitAccessToken -fitbitRefreshToken -lastTokenRefresh')
        .populate('members', 'userId email name role emailVerified isTempUser')
        .populate(
          'devices',
          'deviceId deviceName deviceVersion owner ownerName lastSyncTime batteryLevel'
        )
        .populate('admins', 'userId');

      if (!project) {
        logger.error(`Project: ${req.query.projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      const isAdmin = project.isAdmin(
        currentUser._id as Types.ObjectId
      );
      const isOwner = project.isOwner(currentUser.userId);

      const membersWithRole = await Promise.all(
        project.members.map(async (memberId) => {
          const member = await User.findById(memberId).select(
            'userId email name role emailVerified isTempUser'
          );
          if (member) {
            return {
              ...member.toObject(),
              isOwner: project.isOwner(member.userId),
              isAdmin: project.isAdmin(
                member._id as Types.ObjectId
              ),
            };
          }
        })
      );

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
          areNotificationsEnabled: project.areNotificationsEnabled,
        },
      });
      return;
    } catch (error) {
      logger.error(`Error fetching project info: ${error}`);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
  }

  static async changeDeviceName(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    const { deviceId, deviceName } = req.body;

    try {
      logger.info(`Changing device name for ${deviceId} to ${deviceName}`);

      const device = await Device.findOne({
        deviceId: deviceId,
        projectId: currentProject.projectId,
      });

      if (!device) {
        throw new Error('Device not found');
      }

      if (!currentProject.hasDevice(device._id as Types.ObjectId)) {
        throw new Error('Device not associated with project');
      }

      device.deviceName = deviceName;
      await device.save();

      logger.info(`Device name changed successfully: ${deviceId}`);
      res
        .status(200)
        .json({ message: 'Device name changed successfully', device });
      return;
    } catch (error: any) {
      logger.error(`Error changing device name: ${error}`);
      res
        .status(error.message === 'Device not found' ? 404 : 400)
        .json({ msg: error.message });
      return;
    }
  }

  // static async changeFitbitAccountNickname(req: Request, res: Response) {
  //   const currentProject = req.project as IProject;
  //   const { fitbitUserId, name } = req.body;

  //   try {
  //     logger.info(
  //       `Changing name for account ${fitbitUserId} for project: ${currentProject.projectId}`
  //     );

  //     const fitbitAccount = await FitbitAccount.findOne({ fitbitUserId });
  //     if (!fitbitAccount) {
  //       logger.error(`Fitbit account not found: ${fitbitUserId}`);
  //       res.status(404).json({ msg: 'Fitbit account not found' });
  //       return;
  //     }

  //     if (!currentProject.fitbitAccounts.includes(fitbitAccount._id as Types.ObjectId)) {
  //       logger.error(
  //         `Fitbit account not linked to project: ${fitbitUserId}`
  //       );
  //       res.status(400).json({ msg: 'Fitbit account not linked to project' });
  //       return;
  //     }

  //     fitbitAccount.name = name;
  //     await fitbitAccount.save();
  //     logger.info(`Name changed successfully for account: ${fitbitUserId}`);
  //     res.status(200).json({ msg: 'Name changed successfully' });
  //     return;
  //   } catch (error) {
  //     logger.error(`Error changing account name: ${error}`);
  //     res.status(500).json({ msg: 'Internal Server Error' });
  //     return;
  //   }
  // }

  static async removeDevice(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    const { deviceId } = req.body;

    try {
      logger.info(
        `Removing device: ${deviceId} from project: ${currentProject.projectId}`
      );

      const device = await Device.findOne({ deviceId: deviceId });
      if (!device) {
        throw new Error('Device not found');
      }

      if (!currentProject.hasDevice(device._id as Types.ObjectId)) {
        throw new Error('Device not associated with project');
      }

      await currentProject.removeDevice(device._id as Types.ObjectId);
      await Device.findByIdAndDelete(device._id as Types.ObjectId);
      Cache.deleteMany({ projectId: currentProject.projectId, deviceId });

      logger.info(
        `Device: ${deviceId} removed successfully from project: ${currentProject.projectId}`
      );
      res.status(200).json({ msg: 'Device removed successfully' });
      return;
    } catch (error: any) {
      logger.error(`Error removing device: ${error}`);
      res
        .status(error.message === 'Device not found' ? 404 : 400)
        .json({ msg: error.message });
      return;
    }
  }

  static async getProjectFitbitAccounts(req: Request, res: Response) {
    const currentProject = req.project as IProject;

    try {
      logger.info(
        `Fetching Fitbit accounts for project: ${currentProject.projectId}`
      );

      const fitbitAccounts = await FitbitAccount.find({
        project_id: currentProject._id,
      }).select('userId lastTokenRefresh accessToken refreshToken');

      const accountsWithDevices = await Promise.all(
        fitbitAccounts.map(async (account) => {
          const devices = await Device.find({
            projectId: currentProject.projectId,
            fitbitUserId: account.userId,
          }).select(
            'deviceId deviceName deviceVersion batteryLevel lastSyncTime'
          );

          return {
            _id: account._id,
            userId: account.userId,
            lastTokenRefresh: account.lastTokenRefresh,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            devices: devices,
          };
        })
      );

      res.status(200).json(accountsWithDevices);
      return;
    } catch (error) {
      logger.error(`Error fetching Fitbit accounts with devices: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async unlinkFitbitAccount(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    const fitbitUserId = req.body.fitbitUserId as string;

    try {
      logger.info(
        `Unlinking Fitbit account from project: ${currentProject.projectId}`
      );

      const fitbitAccount = await FitbitAccount.findOne({
        userId: fitbitUserId
      });

      if (!fitbitAccount) {
        res
          .status(404)
          .json({ msg: 'Fitbit account not found in this project' });
        return;
      } else if (!currentProject.fitbitAccounts.includes(fitbitAccount._id as Types.ObjectId)) {
        res
          .status(400)
          .json({ msg: 'Fitbit account not found in this project' });
        return;
      }

      await Device.deleteMany({
        projectId: currentProject.projectId,
        fitbitUserId: fitbitAccount.userId,
      });
      await Cache.deleteMany({
        projectId: currentProject.projectId,
        fitbitUserId: fitbitAccount.userId,
      });

      await fitbitAccount.deleteOne();

      currentProject.fitbitAccounts = currentProject.fitbitAccounts.filter(
        (id) => !id.equals(fitbitAccount._id as Types.ObjectId)
      );
      await currentProject.save();

      logger.info(
        `Fitbit account unlinked successfully for project: ${currentProject.projectId}`
      );
      res.status(200).json({ msg: 'Fitbit account linked successfully' });
      return;
    } catch (error) {
      logger.error(`Error unlinking Fitbit account: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async toggleNotifications(req: Request, res: Response) {
    const currentProject = req.project as IProject;

    try {
      logger.info(
        `Toggling notifications for project: ${currentProject.projectId}`
      );

      const project = await Project.findOne({
        projectId: currentProject.projectId,
      });

      if (!project) {
        logger.error(`Project: ${currentProject.projectId} not found`);
        res.status(404).json({ msg: 'Project not found' });
        return;
      }

      project.areNotificationsEnabled = !project.areNotificationsEnabled;

      await project.save();

      res.status(200).json({
        msg: 'Notifications toggled successfully',
        areNotificationsEnabled: project.areNotificationsEnabled,
      });
    } catch (error) {
      logger.error(`Error toggling notifications: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  }

  static async fetchDevicesHandler(req: Request, res: Response) {
    const currentProject = req.project as IProject;

    try {
      logger.info(`Fetching devices for project: ${currentProject.projectId}`);

      const devicesForProject = [];

      const fitbitAccounts = await FitbitAccount.find({
        _id: { $in: currentProject.fitbitAccounts },
      });

      for (const fitbitAccount of fitbitAccounts) {
        const projectDevices = await fetchDevices(
          fitbitAccount.userId,
          fitbitAccount.accessToken,
          currentProject.projectId,
          { id: fitbitAccount.userId, name: 'Project' }
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

  static async fetchIntradayDataHandler(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    try {
      logger.info(
        `Fetching intraday data for project: ${currentProject.projectId}`
      );

      const { dataType, date, detailLevel } = req.query;

      const fitbitAccounts = await FitbitAccount.find({
        _id: { $in: currentProject.fitbitAccounts },
      });

      if (fitbitAccounts.length === 0) {
        logger.error(
          `No fitbit accounts linked to project: ${currentProject.projectId}`
        );
        res.status(400).json({ msg: 'No fitbit accounts linked to project' });
        return;
      }

      const projectData = await Promise.all(
        fitbitAccounts.map(async (account) => {
          return {
            fitbitUserId: account.userId,
            data: await fetchIntradayData(
              account.userId,
              account.accessToken,
              dataType as string,
              date as string,
              detailLevel as string
            ),
          };
        })
      );

      const tempUsers = await User.find({
        projects: currentProject._id,
        isTempUser: true,
        fitbitUserId: { $exists: true, $ne: null },
        fitbitAccessToken: { $exists: true, $ne: null },
      });

      const tempUserData = await Promise.all(
        tempUsers.map(async (tempUser) => {
          return {
            userId: tempUser.userId,
            data: await fetchIntradayData(
              tempUser.fitbitUserId!,
              tempUser.fitbitAccessToken!,
              dataType as string,
              date as string,
              detailLevel as string
            ),
          };
        })
      );

      const allData = {
        projectData,
        tempUserData,
      };

      logger.info(
        `Intraday data fetched successfully for project: ${currentProject.projectId}`
      );
      res.json(allData);
    } catch (error) {
      logger.error(`Error fetching intraday data: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  static async deleteCachedFiles(req: Request, res: Response) {
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

  static async getCachedFiles(req: Request, res: Response) {
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

  static async downloadCachedFile(req: Request, res: Response) {
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

  static async downloadDataHandler(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    const deviceIds = (req.query.deviceIds as string).split(',');
    const dataTypes = (req.query.dataTypes as string).split(',');
    const startDate = DateTime.fromFormat(req.query.startDate as string, 'MM/dd/yyyy').toISODate();
    const endDate = DateTime.fromFormat(req.query.endDate as string, 'MM/dd/yyyy').toISODate();
    const detailLevel = req.query.detailLevel as string || '1min';
    const archiveName = req.query.archiveName as string;
    const useDailyData = req.query.useDailyData === 'true';

    if (!deviceIds || deviceIds.length === 0) {
      res.status(400).json({ msg: 'Invalid or missing deviceIds' });
      return;
    }

    if (!dataTypes || dataTypes.length === 0) {
      res.status(400).json({ msg: 'Invalid or missing dataTypes'});
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({ msg: 'Start date and end date are required'});
      return;
    }

    try {
      logger.info(`Batch downloading data for project: ${currentProject.projectId}`);
  
      const dataToZip = [];
      const dateRange = getDateRange(startDate, endDate);
  
      const projectFitbitAccounts = await FitbitAccount.find({
        _id: { $in: currentProject.fitbitAccounts },
      });
  
      for (const deviceId of deviceIds) {
        const device = await Device.findOne({
          deviceId,
          projectId: currentProject.projectId,
        });
  
        if (!device) {
          logger.error(`Device: ${deviceId} not found in project ${currentProject.projectId}`);
          continue;
        }
  
        let accessToken: string | undefined;
        let userId: string | undefined;
  
        const fitbitAccount = projectFitbitAccounts.find(
          (account) => account.userId === device.fitbitUserId
        );
  
        if (fitbitAccount) {
          accessToken = fitbitAccount.accessToken;
          userId = fitbitAccount.userId;
        } else {
          const user = await User.findOne({
            userId: device.owner,
            isTempUser: true,
          });
          if (user && user.fitbitAccessToken && user.fitbitUserId) {
            accessToken = user.fitbitAccessToken;
            userId = user.fitbitUserId;
          } else {
            logger.error(`Fitbit credentials not found for device: ${deviceId}`);
            continue;
          }
        }
  
        const deviceData: { [date: string]: { [dataType: string]: any[] } } = {};
  
        for (const date of dateRange) {
          for (const dataType of dataTypes) {
            const cacheKey = `${currentProject.projectId}-${deviceId}-${dataType}-${date}-${useDailyData ? 'daily' : detailLevel}`;
            let cachedData = await Cache.findOne({
              key: cacheKey,
              projectId: currentProject.projectId,
              deviceId
            });

            if (!cachedData) {
              let data;
              if (useDailyData) {
                data = await fetchData(userId, accessToken, date, date, dataType);
              } else {
                data = await fetchIntradayData(userId, accessToken, dataType, date, detailLevel);
              }
              const csvData = data.map((d: any) => `${d.dateTime || d.timestamp},${d.value}`);

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

            if (!deviceData[date]) deviceData[date] = {};
            deviceData[date][dataType] = cachedData.data.split('\n').map(line => {
              const [timestamp, value] = line.split(',');
              return { timestamp, value };
            }).filter(item => item.timestamp && item.value);
          }
        }
  
        const csvContent = generateCSV(deviceData, dataTypes, useDailyData);
        const fileName = `${currentProject.projectId}-${deviceId}.csv`;
        dataToZip.push({ fileName, data: csvContent });
      }
  
      if (dataToZip.length === 0) {
        res.status(400).json({ msg: 'No data found for the specified devices' });
        return;
      }
  
      if (dataToZip.length === 1) {
        const singleFile = dataToZip[0];
        let singleFileName = archiveName || singleFile.fileName;

        if (!singleFileName.toLowerCase().endsWith('.csv')) {
          singleFileName += '.csv';
        }

        res.setHeader('Content-Disposition', `attachment; filename=${singleFileName}`);
        res.set('Content-Type', 'text/csv');
        res.send(singleFile.data);
      } else {
        const tempFolderPath = path.resolve(
          __dirname,
          `../tmp/${currentProject.projectId}-${Date.now()}`
        );
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
          } else {
            fs.unlinkSync(zipFilePath);
          }
        });
      }
    } catch (error) {
      logger.error(`Error downloading data: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
}

export default ProjectController;
