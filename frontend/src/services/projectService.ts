// projectService.ts
import axios from "axios";

const CREATE_PROJECT_ENDPOINT = `${process.env.API_URL}/admin/create-project`;
const DELETE_PROJECT_ENDPOINT = `${process.env.API_URL}/admin/delete-project`;

export const createProjectService = async (projectName: string, projectDescription: string) => {
  try {
    const response = await axios.post(
      CREATE_PROJECT_ENDPOINT,
      { projectName: projectName,
        projectDescription: projectDescription,
       },
      { withCredentials: true }
    );
    return response.data.project;  // Assuming the API returns the newly created project object
  } catch (error) {
    throw new Error('Failed to create the project: ' + error);
  }
};
export const deleteProjectService = async (projectId: string) => {
  try {
    const response = await axios.post(
      DELETE_PROJECT_ENDPOINT,
      { projectId: projectId },
      { withCredentials: true }
    );
    return response; 
  } catch (error) {
    throw new Error('Failed to delete the project: ' + error);
  }
}

export const unlinkFitBitAccountService = async () => {
  const UNLINK_FITBIT_ACCOUNT_ENDPOINT = `${process.env.API_URL}/project/unlink-fitbit`;
  try {
    await axios.put(
      UNLINK_FITBIT_ACCOUNT_ENDPOINT,
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error('Failed to unlink the Fitbit account: ' + error);
  }
}


export const oAuthLogin = async (projectId: string) => {
  window.location.href = "https://vitametrics.org/api/auth?projectId=" + projectId;
};