import { ProjectDevice } from "./Device";

export interface Project {
    projectId: string;
    projectName: string;
    devices: ProjectDevice[];
  }
  
export interface Account {
    userId: string;
    accessToken: string;
    refreshToken: string;
    lastTokenRefresh: string;
    projects: Project[];
  }
  
export interface AccountsListProps {
    accounts: Account[];
    refreshFitbitAccounts: () => void;
  }