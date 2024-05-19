import axios from 'axios';

import logger from '../logger';

async function fetchData(
  orgUserId: string,
  accessToken: string,
  startDate: string | undefined,
  endDate: string | undefined
) {
  const results = [];

  try {
    const deviceInfoResponse = await axios.get(
      `https://api.fitbit.com/1/user/${orgUserId}/devices.json`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    for (const device of deviceInfoResponse.data) {
      if (device.deviceVersion === 'MobileTrack') {
        continue; // Skip 'MobileTrack' devices
      }

      const result = {
        deviceId: device.id,
        deviceInfo: device,
        heartData: [],
        stepsData: [],
      };

      const heartRateEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/heart/date/${startDate}/${endDate}.json?deviceId=${device.id}`;
      const stepsEndpoint = `https://api.fitbit.com/1/user/${orgUserId}/activities/steps/date/${startDate}/${endDate}.json?deviceId=${device.id}`;

      try {
        const [heartResponse, stepsResponse] = await Promise.all([
          axios.get(heartRateEndpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(stepsEndpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        result.heartData = heartResponse.data['activities-heart'].map(
          (data: any) => ({
            dateTime: data.dateTime,
            value: data.value,
          })
        );

        result.stepsData = stepsResponse.data['activities-steps'].map(
          (data: any) => ({
            dateTime: data.dateTime,
            value: data.value,
          })
        );

        logger.info(`[fetchData] Fetched data for device: ${device.id}`);
        results.push(result);
      } catch (error) {
        logger.error(
          `[fetchData] Error fetching activity data for device: ${device.id}. Error: ${error}`
        );
      }
    }
  } catch (error) {
    logger.error(
      `[fetchData] Error fetching device information from Fitbit: ${error}`
    );
    throw error;
  }

  return results;
}

export default fetchData;
