import axios from 'axios';
import { DateTime } from 'luxon';

interface IntradayEntry {
    time: string;
    value: number;
}

interface IntradayData {
    timestamp: string;
    value: number;   
}

function validateDetailLevel(detailLevel: string, dataType: string): void {
    const validDetails = ["1sec", "1min", "5min", "15min"];
    if (!validDetails.includes(detailLevel)) {
        throw new Error('Invalid detail level');
    }
    if (detailLevel === "1sec" && dataType !== "heart") {
        throw new Error('Invalid detail level');
    }
}

function validateDataType(dataType: string): void {
    const validDataTypes = ['heart', 'steps', 'calories', 'distance', 'elevation', 'floors'];
    if (!validDataTypes.includes(dataType)) {
        throw new Error('Invalid data type');
    }
}

// note: date is YYYY-MM-DD format
async function fetchIntradayData(userId: string, accessToken: string, dataType: string, date: string, detailLevel: string): Promise<IntradayData[]> {

    validateDetailLevel(detailLevel, dataType);
    validateDataType(dataType);

    const baseUrl = `https://api.fitbit.com/1/user/${userId}/activities`;
    const url = `${baseUrl}/${dataType}/date/${date}/1d/${detailLevel}.json`;

    try {

        const response = await axios.get<{ 'activities-${dataType}-intraday': { dataset: IntradayEntry[] } }>(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        return response.data['activities-${dataType}-intraday'].dataset.map(entry => ({
            timestamp: DateTime.fromISO(`${date}T${entry.time}`).toFormat('yyyy-MM-dd HH:mm:ss'),
            value: entry.value
        }));

    } catch (err) {
        console.error('Error fetching data from Fitbit: ', err);
        throw err;
    }
}

export default fetchIntradayData;