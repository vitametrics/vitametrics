import axios from 'axios';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: '192.168.1.101',
    database: 'physiobit',
    password: 'MsWHXSNun4LUaZHT4tTCjdc',
    port: 5432
});


async function fetchAndStoreData(orgId: string, orgUserId: string, accessToken: string, deviceId: string, startDate: string | undefined, endDate: string | undefined) {
    try {
        // check if device exists in organization (check that device contains the organization id)
        const deviceRes = await pool.query(
            'SELECT * FROM devices WHERE device_id = $1 AND organization_id = $2',
            [deviceId.toString(), orgId]
        );

        if (deviceRes.rowCount === 0) {
            throw new Error('Device not found or does not belong to the organization.');
        }

        const deviceInfoResponse = await axios.get(`https://api.fitbit.com/1/user/${orgUserId}/devices.json`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const deviceInfo = deviceInfoResponse.data.find((device: any) => device.id === deviceId);
        if (!deviceInfo) {
            throw new Error('Device details not found in Fitbit response.');
        }

        let heartRateEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/heart/date/${startDate}/${endDate}.json?deviceId=${deviceId}`;
        const heartRateResponse = await axios.get(heartRateEndpoint, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        let stepsEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/steps/date/${startDate}/${endDate}.json?deviceId=${deviceId}`;
        const stepsResponse = await axios.get(stepsEndpoint, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        for (const stepsData of stepsResponse.data['activities-steps']) {
            await pool.query(`
                INSERT INTO steps_data (device_id, date, steps) 
                VALUES ($1, $2, $3) 
                ON CONFLICT (device_id, date) DO UPDATE 
                SET steps = EXCLUDED.steps`,
                [deviceId.toString(), stepsData.dateTime, parseInt(stepsData.value)]
            );
        }


        for (const heartRateData of heartRateResponse.data['activities-heart']) {

            await pool.query(`
                INSERT INTO heart_rate_data (device_id, date, resting_hr) 
                VALUES ($1, $2, $3) 
                ON CONFLICT (device_id, date) DO UPDATE 
                SET resting_HR = EXCLUDED.resting_HR`,
                [deviceId.toString(), heartRateData.dateTime, heartRateData.value.restingHeartRate]
            );
        }

        const { batteryLevel, lastSyncTime } = deviceInfo;

        // Update the last sync time and batteryLevel
        await pool.query(`
            UPDATE devices
            SET battery_level = $1, last_sync_date = NOW(), last_fitbit_sync = $4
            WHERE device_id = $2 AND organization_id = $3`,
            [batteryLevel, deviceId, orgId, lastSyncTime]
        );

    } catch (err) {
        console.error(`Error fetching data for device ${deviceId}: `, err);
    }
}

export default fetchAndStoreData;