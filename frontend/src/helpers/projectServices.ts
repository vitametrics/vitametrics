// projectServices.ts

import axios from 'axios';
import { Device } from '../types/Device';
import { fetchFitbitAccounts } from './fitbit';

const GET_PROJECT_ENDPOINT = `${process.env.API_URL}/project/info`;
const FETCH_PROJECT_DEVICES_ENDPOINT = `${process.env.API_URL}/project/fetch-devices`;
const DOWNLOAD_HISTORY_ENDPOINT = `${process.env.API_URL}/project/get-cached-files`;

export const fetchFBAccounts = async (projectId: string) => {
  try {
    const accounts = await fetchFitbitAccounts(projectId);
    return accounts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchDownloadHistory = async () => {
  try {
    const response = await axios.get(DOWNLOAD_HISTORY_ENDPOINT, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchProject = async (projectId: string) => {
  try {
    const response = await axios.get(GET_PROJECT_ENDPOINT, {
      params: {
        projectId: projectId,
      },
      withCredentials: true,
    });
    return response.data.project;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const fetchProjectDevices = async (projectId: string) => {
  try {
    const response = await axios.post(
      FETCH_PROJECT_DEVICES_ENDPOINT,
      {
        projectId: projectId,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchDeviceDetails = (projectDevices: Device[], deviceId: string) => {
  const device = projectDevices.find(
    (device) => device.deviceId === deviceId
  );

  return device ? device : 'Device not found';
};
