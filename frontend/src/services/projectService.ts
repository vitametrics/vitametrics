// projectService.ts
import axios from "axios";

const DELETE_PROJECT_ENDPOINT = import.meta.env.VITE_APP_NODE_ENV === "production"
  ? import.meta.env.VITE_APP_DELETE_PROJECT_ENDPOINT
  : import.meta.env.VITE_APP_DELETE_PROJECT_DEV_ENDPOINT;

export const deleteProjectService = async (projectId: string) => {
  console.log("deleting from service:" + projectId)
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
