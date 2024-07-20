/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Project {
    admins: [],
    areNotificationsEnabled: boolean,
    createdAt: string,
    creationDate: string,
    devices: [],
    lastTokenRefresh: string,
    members: [],
    ownerEmail: string,
    ownerId: string,
    projectDescription: string,
    projectId: string,
    projectName: string,
    updatedAt: string,
    _id: string
    membersCount: number,
    devicesCount: number,
}


export interface ProjectInfoProps {
    projectId: string;
    setProjectIdToDelete: (projectId: string) => void;
    handleDeleteProject: () => void;
    handleClose: () => void;
  }

  export interface DashboardProject {
    projectId: string;
    projectName: string;
    memberCount: number;
    deviceCount: number;
    isOwner: boolean;
  }