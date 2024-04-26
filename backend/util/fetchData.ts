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


        if (deviceInfoResponse.data[0].deviceVersion !== 'MobileTrack') {
            // console.log(deviceInfoResponse);

            // console.log(`Does ${deviceId} equal ${await deviceInfoResponse.data[0].id}?`)
            if (deviceInfoResponse.data[0].id !== deviceId) {
                throw new Error('Device details not found in Fitbit response.');
            }

            result.deviceInfo = deviceInfoResponse.data[0];

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
        }
    } catch (err) {
        console.error('Error fetching data from Fitbit: ', err);
        throw err;
    }
}

export default fetchData;