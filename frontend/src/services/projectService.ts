// projectService.ts
import axios from "axios";

const CREATE_PROJECT_ENDPOINT = `${import.meta.env.VITE_API_URL}/admin/create-project`;
const DELETE_PROJECT_ENDPOINT = `${import.meta.env.VITE_API_URL}/admin/delete-project`;

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
