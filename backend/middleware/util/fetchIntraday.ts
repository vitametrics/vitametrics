import axios from 'axios';
import { DateTime } from 'luxon';

import logger from '../logger';

interface IntradayData {
  timestamp: string;
  value: number;
}

function validateDetailLevel(detailLevel: string, dataType: string): void {
  const validDetails = ['1sec', '1min', '5min', '15min'];
  if (!validDetails.includes(detailLevel)) {
    logger.error('Invalid detail level');
    throw new Error('Invalid detail level');
  }
  if (detailLevel === '1sec' && dataType !== 'heart') {
    logger.error('Invalid detail level');
    throw new Error('Invalid detail level');
  }
}

function validateDataType(dataType: string): void {
  const validDataTypes = [
    'heart',
    'steps',
    'calories',
    'distance',
    'elevation',
    'floors',
  ];
  if (!validDataTypes.includes(dataType)) {
    logger.error('Invalid data type');
    throw new Error('Invalid data type');
  }
}

// note: date is YYYY-MM-DD format
async function fetchIntradayData(
  userId: string,
  accessToken: string,
  dataType: string,
  date: string,
  detailLevel: string
): Promise<IntradayData[]> {
  validateDetailLevel(detailLevel, dataType);
  validateDataType(dataType);

  const baseUrl = `https://api.fitbit.com/1/user/${userId}/activities`;
  const url = `${baseUrl}/${dataType}/date/${date}/1d/${detailLevel}.json`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const processedData = response.data[
      `activities-${dataType}-intraday`
    ].dataset.map((entry: { time: string; value: number }) => {
      return {
        timestamp: DateTime.fromISO(`${date}T${entry.time}`).toFormat(
          'yyyy-MM-dd HH:mm:ss'
        ),
        value: entry.value,
      };
    });

    return processedData;
  } catch (error) {
    logger.error(`[fetchIntraday] Error fetching data from Fitbit: ${error}`);
    throw error;
  }
}

export default fetchIntradayData;
