import axios, { AxiosResponse } from 'axios';

import Device from '../../models/Device';
import Project from '../../models/Project';
import logger from '../logger';
import User from '../../models/User';

interface FitbitDeviceInfo {
  id: string;
  deviceVersion: string;
  batteryLevel: string;
  lastSyncTime: Date;
}
interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceVersion: string;
  batteryLevel: string;
  lastSyncTime: string;
}

async function fetchDevices(
  fitbitUserID: string,
  fitbitAccessToken: string,
  projectId: string,
  userId: string | undefined
): Promise<DeviceInfo[]> {
  try {

    let deviceResponse;
    let userName = 'Project';

    if (!userId) {
      deviceResponse = await axios.get(
        `https://api.fitbit.com/1/user/${fitbitUserID}/devices.json`,
        {
          headers: { Authorization: `Bearer ${fitbitAccessToken}` },
        }
      ) as AxiosResponse<FitbitDeviceInfo[]>;
    } else {
      const user = await User.findOne({ userId });
      if (!user) {
        logger.error(`[fetchDevices] User not found: ${userId}`);
        throw new Error('User not found');
      }

      userName = user.name;

      deviceResponse = await axios.get(
        `https://api.fitbit.com/1/user/${user.fitbitUserId}/devices.json`,
        {
          headers: { Authorization: `Bearer ${user.fitbitAccessToken}` },
        }
      ) as AxiosResponse<FitbitDeviceInfo[]>;

    }

    const validDevices = deviceResponse.data;

    const existingDevices = await Device.find({
      deviceId: { $in: validDevices.map((device) => device.id) },
    });

    const existingDeviceIds = new Set(
      existingDevices.map((device) => device.deviceId)
    );

    const newDevices = validDevices.filter(
      (device) => !existingDeviceIds.has(device.id)
    );

    if (userId) {
      for (const device of newDevices) {
        const newDevice = new Device({
          owner: userId,
          ownerName: userName,
          deviceId: device.id,
          deviceVersion: device.deviceVersion,
          batteryLevel: device.batteryLevel,
          deviceName: device.deviceVersion,
          lastSyncTime: device.lastSyncTime
        });
  
        const savedDevice = await newDevice.save();
  
        await Project.updateOne(
          { projectId },
          { $addToSet: { devices: savedDevice._id } }
        );
      }
    } else {
      for (const device of newDevices) {
        const newDevice = new Device({
          owner: 'Project',
          ownerName: 'Project',
          deviceId: device.id,
          deviceVersion: device.deviceVersion,
          batteryLevel: device.batteryLevel,
          deviceName: device.deviceVersion,
          lastSyncTime: device.lastSyncTime
        });
  
        const savedDevice = await newDevice.save();
  
        await Project.updateOne(
          { projectId },
          { $addToSet: { devices: savedDevice._id } }
        );
      }
    }

    // update existing devices
    for (const device of existingDevices) {
      await Device.findOneAndUpdate(
        { deviceId: device.id },
        { 
          batteryLevel: device.batteryLevel,
          lastSyncTime: device.lastSyncTime
        }
      );
    }

    const allDevices = await Device.find({
      deviceId: { $in: validDevices.map((device) => device.id) },
    });

    const deviceInfoList: DeviceInfo[] = allDevices.map((device) => ({
      deviceId: device.deviceId,
      owner: device.owner,
      ownerName: device.ownerName,
      deviceName: device.deviceName,
      deviceVersion: device.deviceVersion,
      batteryLevel: device.batteryLevel,
      lastSyncTime: device.lastSyncTime
    }));

    logger.info(`[fetchDevices] Fetched devices for project: ${projectId}`);
    return deviceInfoList;
  } catch (error) {
    logger.error(`[fetchDevices] Error fetching devices from fitbit: ${error}`);
    throw error;
  }
}

export default fetchDevices;
