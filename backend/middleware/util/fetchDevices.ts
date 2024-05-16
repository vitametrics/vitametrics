import axios, { AxiosResponse } from 'axios';
import Project from '../../models/Project';
import Device from '../../models/Device';

interface DeviceInfo {
    id: string;
    deviceVersion: string;
}

async function fetchDevices(projectFitbitUserId: string, projectFitbitAccessToken: string, projectId: string): Promise<DeviceInfo[]> {
    try {

        const deviceResponse: AxiosResponse<DeviceInfo[]> = await axios.get(`https://api.fitbit.com/1/user/${projectFitbitUserId}/devices.json`, {
            headers: {'Authorization': `Bearer ${projectFitbitAccessToken}`}
        });

        const validDevices = deviceResponse.data.filter(device => device.deviceVersion !== 'MobileTrack');

        for (const device of validDevices) {
            const updatedDevice = await Device.findOneAndUpdate(
                { deviceId: device.id },
                { deviceName: device.deviceVersion},
                { new: true, upsert: true }
            );

            if (updatedDevice) {
                await Project.updateOne(
                    { projectId },
                    { $addToSet: {devices: device.id}}
                );
            } else {
                console.error('Device not created or not found for ID: ', device.id);
            }
        }

        return validDevices;

    } catch (error) {
        console.error('Error fetching devices from Fitbit: ', error);
        throw error;
    }
}

export default fetchDevices;