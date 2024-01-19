import axios from 'axios';
import Device from '../models/Device';


async function fetchAndStoreData(userId: String, accessToken: String, timePeriod: String) {
    try {
        const devices = await Device.find({userId});

        for (const device of devices) {
            let heartRateEndpoint = `https://api.fitbit.com/1/user/${userId}/activities/heart/date/today/1d`;
            if (timePeriod === 'hour') {
                heartRateEndpoint += '/1sec';
            } else if (timePeriod === 'minute-wide' || timePeriod === 'minute-narrow') {
                heartRateEndpoint += '/1min';
            }
            heartRateEndpoint += '.json';

            const heartRateResponse = await axios.get(heartRateEndpoint, {
                headers: {'Authorization': `Bearer ${accessToken}`}
            });

            let sleepEndpoint = `https://api.fitbit.com/1.2/user/${userId}/sleep/date/today`;
            if (timePeriod === 'minute-wide' || timePeriod === 'minute-narrow') {
                sleepEndpoint += '/1min';
            }
            sleepEndpoint += '.json';

            const sleepResponse = await axios.get(sleepEndpoint, {
                headers: {'Authorization': `Bearer ${accessToken}`}
            });

            await Device.findOneAndUpdate(
                { _id: device._id },
                {
                    heartRateData: heartRateResponse.data['activities-heart'],
                    sleepData: sleepResponse.data.sleep,
                },
                { new: true }
            );
        }

    } catch (err) {
        console.error("Error fetching heart rate data: ", err);
    }
}

export default fetchAndStoreData;