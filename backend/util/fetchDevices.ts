import axios from 'axios';
import Organization from '../models/Organization';

async function fetchDevices(userId: string, accessToken: string, orgId: string) {
    console.log('made it to fetch devices');
    const deviceResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/devices.json`, {
        headers: {'Authorization': `Bearer ${accessToken}`}
    });

    for (const deviceData of deviceResponse.data) {

        // add fetched devices to mongodb organization document
        await Organization.updateOne(
            {orgId: orgId},
            {$addToSet: {devices: deviceData.id}}
        );
    }
}

export default fetchDevices;