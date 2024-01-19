import axios from 'axios';
import Device from '../models/Device';

async function fetchAndStoreDevices(userId: String, accessToken: String) {

    const deviceResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/devices.json`, {
        headers: {'Authorization': `Bearer ${accessToken}`}
    });

    for (const deviceData of deviceResponse.data) {
        await Device.findOneAndUpdate(
            {deviceId: deviceData.id, userId: userId},
            {
                deviceType: deviceData.type,
                userFullName: 'N/A'
            },
            { upsert: true, new: true}
        )
    }
}

export default fetchAndStoreDevices;