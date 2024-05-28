import axios from 'axios';

interface DailyData {
  dateTime: string;
  value: number;
}

async function fetchData(
  fitbitUserId: string,
  accessToken: string,
  startDate: string,
  endDate: string,
  dataType: string
): Promise<DailyData[]> {
  const url = `https://api.fitbit.com/1/user/${fitbitUserId}/activities/${dataType}/date/${startDate}/${endDate}.json`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data[`activities-${dataType}`].map((data: any) => ({
      dateTime: data.dateTime,
      value: data.value,
    }));
  } catch (error) {
    console.error(`Error fetching ${dataType} data from Fitbit: `, error);
    throw error;
  }
}

export default fetchData;
