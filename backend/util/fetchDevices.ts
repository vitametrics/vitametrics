import axios from 'axios';
import Device from '../models/Device';
import Organization from '../models/Organization';

async function fetchAndStoreDevices(userId: string, accessToken: string, orgId: string) {
    
    const deviceResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/devices.json`, {
        headers: {'Authorization': `Bearer ${accessToken}`}
    });

    for (const deviceData of deviceResponse.data) {
        const updatedDevice = await Device.findOneAndUpdate(
            { deviceId: deviceData.id },
            { 
                deviceType: deviceData.type,
                lastSyncDate: deviceData.lastSyncTime ? new Date(deviceData.lastSyncTime) : undefined 
            },
            { upsert: true, new: true }
        );

        await Organization.updateOne(
            { orgId: orgId },
            { $addToSet: { devices: updatedDevice._id } }
        );
    }
}

export default fetchAndStoreDevices;
