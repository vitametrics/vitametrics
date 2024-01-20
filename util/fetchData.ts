import axios from 'axios';
import Device from '../models/Device';


async function fetchAndStoreData(userId: string, accessToken: string, deviceId: string) {
    try {
        let heartRateEndpoint = `https://api.fitbit.com/1/user/${userId}/activities/heart/date/today/1d.json?deviceId=${deviceId}`;

        let sleepEndpoint = `https://api.fitbit.com/1.2/user/${userId}/sleep/date/today.json?deviceId=${deviceId}`;

        const heartRateResponse = await axios.get(heartRateEndpoint, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const sleepResponse = await axios.get(sleepEndpoint, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        await Device.findOneAndUpdate(
            { userId, deviceId },
            {
                heartRateData: heartRateResponse.data['activities-heart'],
                sleepData: sleepResponse.data.sleep,
            },
            { new: true }
        );
    } catch (err) {
        console.error(`Error fetching data for device ${deviceId}: `, err);
    }
}

export default fetchAndStoreData;