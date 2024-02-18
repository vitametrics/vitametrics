import axios from 'axios';
import Organization from '../models/Organization';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: '192.168.1.101',
    database: 'physiobit',
    password: 'MsWHXSNun4LUaZHT4tTCjdc',
    port: 5432
});

async function fetchAndStoreDevices(userId: string, accessToken: string, orgId: string) {
    
    const deviceResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/devices.json`, {
        headers: {'Authorization': `Bearer ${accessToken}`}
    });

    for (const deviceData of deviceResponse.data) {
        // Upsert device data into TimescaleDB
        await pool.query(`
            INSERT INTO devices (device_id, device_type, last_sync_date, organization_id) 
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (device_id) DO UPDATE 
            SET device_type = EXCLUDED.device_type, last_sync_date = EXCLUDED.last_sync_date, organization_id = EXCLUDED.organization_id`,
            [deviceData.id, deviceData.deviceVersion, deviceData.lastSyncTime ? new Date(deviceData.lastSyncTime).toISOString() : null, orgId]
        );

        // Update MongoDB organization document with the new device ID
        await Organization.updateOne(
            { orgId: orgId },
            { $addToSet: { devices: deviceData.id } } // Ensure device ID is unique in the array
        );
    }
}

export default fetchAndStoreDevices;
