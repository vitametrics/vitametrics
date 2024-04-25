import axios from 'axios';

async function fetchData(orgUserId: string, accessToken: string, deviceId: string, startDate: string | undefined, endDate: string | undefined) {

    const result = {
        deviceInfo: {},
        heartData: [],
        stepsData: []
    };

    try {

        const deviceInfoResponse = await axios.get(`https://api.fitbit.com/1/user/${orgUserId}/devices.json`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const deviceInfo = deviceInfoResponse.data.find((device: any) => device.deviceId === deviceId);
        if (!deviceInfo) {
            throw new Error('Device details not found in Fitbit response.');
        }

        result.deviceInfo = deviceInfo;

        let heartRateEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/heart/date/${startDate}/${endDate}.json?deviceId=${deviceId}`;

        const heartResponse = await axios.get(heartRateEndpoint, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        });

        let stepsEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/steps/date/${startDate}/${endDate}.json?deviceId=${deviceId}`;
        const stepsResponse = await axios.get(stepsEndpoint, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        });

        result.stepsData = stepsResponse.data['activities-steps'].map((data: any) => ({
            dateTime: data.dateTime,
            value: data.value,
        }));

        result.heartData = heartResponse.data['activities-heart'].map((data: any) => ({
            dateTime: data.dateTime,
            value: data.value,
        }));

    } catch (err) {
        console.error('Error fetching data from Fitbit: ', err);
        throw err;
    }
}

export default fetchData;