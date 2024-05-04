import axios from 'axios';
import { DateTime } from 'luxon';

// note: date is YYYY-MM-DD format
async function fetchIntradayData(userId: string, accessToken: string, dataType: string, date: string, detailLevel: string) {
    const baseUrl = `https://api.fitbit.com/1/user/${userId}/activities`;

    if (detailLevel !== "1sec" && detailLevel !== "1min" && detailLevel !== "5min" && detailLevel !== "15min") {
        throw new Error('Invalid detail level');
    }

    if (detailLevel === "1sec" && dataType !== "heart") {
        throw new Error('Invalid detail level');
    }

    const dataTypes = {
        heart: 'heart',
        steps: 'steps',
        calories: 'calories',
        distance: 'distance',
        elevation: 'elevation',
        floors: 'floors'
    };

    if (!dataTypes[dataType as keyof typeof dataTypes]) {
        throw new Error('Invalid data type');
    }

    const url = `${baseUrl}/${dataType}/date/${date}/1d/${detailLevel}.json`;

    try {
        const response = await axios.get(url, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        });
        
        const processedData = response.data[`activities-${dataType}-intraday`].dataset.map((entry: { time: string; value: number; }) => {
            return {
                timestamp: DateTime.fromISO(`${date}T${entry.time}`).toFormat('yyyy-MM-dd HH:mm:ss'),
                value: entry.value
            }
        });

        return processedData;
    } catch (err) {
        console.error('Error fetching data from Fitbit: ', err);
        throw err;
    }
}

export default fetchIntradayData;