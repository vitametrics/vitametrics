// projectService.ts
import axios from "axios";

const DELETE_PROJECT_ENDPOINT =  `${import.meta.env.VITE_API_URL}/admin/delete-project`;


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
