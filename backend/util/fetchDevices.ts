import axios from 'axios';
import Organization from '../models/Project';
import Device from '../models/Device';

async function fetchDevices(userId: string, accessToken: string, orgId: string) {
    //console.log('made it to fetch devices');
    const deviceResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/devices.json`, {
        headers: {'Authorization': `Bearer ${accessToken}`}
    });
    const validDevices = [];

    for (const deviceData of deviceResponse.data) {

		if (deviceData.deviceVersion === "MobileTrack") {
			continue;
		}
		validDevices.push({
			id: deviceData.id,
			name: deviceData.deviceVersion
		});

        await Device.findOneAndUpdate(
            { deviceId: deviceData.id },
            { deviceName: deviceData.deviceVersion },
            { new: true, upsert: true }
        );

		// add fetched devices to mongodb organization document
        await Organization.updateOne(
            { orgId: orgId },
            { $addToSet: { devices: deviceData.id } }
        );

	}

    // console.log(validDevices);

    return validDevices;
}

export default fetchDevices;
