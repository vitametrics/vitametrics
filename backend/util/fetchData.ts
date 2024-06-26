import axios from 'axios';

async function fetchData(orgUserId: string, accessToken: string, startDate: string | undefined, endDate: string | undefined) {
	const results = [];

	try {
		const deviceInfoResponse = await axios.get(`https://api.fitbit.com/1/user/${orgUserId}/devices.json`, {
			headers: { 'Authorization': `Bearer ${accessToken}` }
		});

		for (const device of deviceInfoResponse.data) {
			if (device.deviceVersion === 'MobileTrack') {
				continue; // Skip 'MobileTrack' devices
			}

			const result = {
				deviceId: device.id,
				deviceInfo: device,
				heartData: [],
				stepsData: []
			};

			let heartRateEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/heart/date/${startDate}/${endDate}.json?deviceId=${device.id}`;
				let stepsEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/steps/date/${startDate}/${endDate}.json?deviceId=${device.id}`;

				try {
				const [heartResponse, stepsResponse] = await Promise.all([
					axios.get(heartRateEndpoint, {
						headers: {'Authorization': `Bearer ${accessToken}`}
					}),
					axios.get(stepsEndpoint, {
						headers: {'Authorization': `Bearer ${accessToken}`}
					})
				]);

				result.heartData = heartResponse.data['activities-heart'].map((data: any) => ({
					dateTime: data.dateTime,
					value: data.value,
				}));

				result.stepsData = stepsResponse.data['activities-steps'].map((data: any) => ({
					dateTime: data.dateTime,
					value: data.value,
				}));

				results.push(result);
			} catch (error) {
				console.error('Error fetching activity data for device: ', device.id, error);
			}
		}
	} catch (err) {
		console.error('Error fetching device information from Fitbit: ', err);
		throw err;
	}

	return results;
}

export default fetchData;
