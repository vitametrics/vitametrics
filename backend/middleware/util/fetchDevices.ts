import axios, { AxiosResponse } from 'axios';

import Device from '../../models/Device';
import Project from '../../models/Project';
import logger from '../logger';

interface FitbitDeviceInfo {
  id: string;
  deviceVersion: string;
  batteryLevel: string;
}
interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceVersion: string;
  batteryLevel: string;
}

async function fetchDevices(
  projectFitbitUserId: string,
  projectFitbitAccessToken: string,
  projectId: string
): Promise<DeviceInfo[]> {
  try {
    const deviceResponse: AxiosResponse<FitbitDeviceInfo[]> = await axios.get(
      `https://api.fitbit.com/1/user/${projectFitbitUserId}/devices.json`,
      {
        headers: { Authorization: `Bearer ${projectFitbitAccessToken}` },
      }
    );

    const validDevices = deviceResponse.data.filter(
      (device) => device.deviceVersion !== 'MobileTrack'
    );

    const existingDevices = await Device.find({
      deviceId: { $in: validDevices.map((device) => device.id) },
    });

    const existingDeviceIds = new Set(
      existingDevices.map((device) => device.deviceId)
    );

    const newDevices = validDevices.filter(
      (device) => !existingDeviceIds.has(device.id)
    );

    for (const device of newDevices) {
      const newDevice = new Device({
        deviceId: device.id,
        deviceVersion: device.deviceVersion,
        batteryLevel: device.batteryLevel,
        deviceName: device.deviceVersion, // default to deviceVersion
      });

      const savedDevice = await newDevice.save();

      await Project.updateOne(
        { projectId },
        { $addToSet: { devices: savedDevice._id } }
      );
    }

    // update existing devices
    for (const device of existingDevices) {
      await Device.findOneAndUpdate(
        { deviceId: device.id },
        { batteryLevel: device.batteryLevel }
      );
    }

    const allDevices = await Device.find({
      deviceId: { $in: validDevices.map((device) => device.id) },
    });

    const deviceInfoList: DeviceInfo[] = allDevices.map((device) => ({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      deviceVersion: device.deviceVersion,
      batteryLevel: device.batteryLevel,
    }));

    logger.info(`[fetchDevices] Fetched devices for project: ${projectId}`);
    return deviceInfoList;
  } catch (error) {
    logger.error(`[fetchDevices] Error fetching devices from fitbit: ${error}`);
    throw error;
  }
}

export default fetchDevices;
