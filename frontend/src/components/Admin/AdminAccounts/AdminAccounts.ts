import { Account, Project } from '../../../types/Account';
import { ProjectDevice } from '../../../types/Device';

export const getUniqueAccounts = (accounts: Account[]) => {
    const uniqueAccountsMap = new Map();
  
    accounts.forEach((account) => {
      let storedAccount = uniqueAccountsMap.get(account.userId);
      if (!storedAccount) {
        storedAccount = {
          ...account,
          projects: [],
        };
        uniqueAccountsMap.set(account.userId, storedAccount);
      }
  
      account.projects.forEach((project: Project) => {
        const existingProject = storedAccount.projects.find((p: Project) => p.projectId === project.projectId);
        if (!existingProject) {
          storedAccount.projects.push({
            ...project,
            devices: [...project.devices]
          });
        } else {
          project.devices.forEach((device: ProjectDevice) => {
            const existingDevice = existingProject.devices.find((d: ProjectDevice) => d.deviceId === device.deviceId);
            if (!existingDevice) {
              existingProject.devices.push({...device});
            }
          });
        }
      });
    });
  
    return Array.from(uniqueAccountsMap.values());
  };
  

  export const aggregateUniqueDevices = (projects: Project[]) => {
    const uniqueDevicesMap = new Map();
  
    projects.forEach((project) => {
      project.devices.forEach((device: ProjectDevice) => {
        const existingDevice = uniqueDevicesMap.get(device.deviceId);
        if (!existingDevice) {
          // Initially set up the device with its basic info and associated project details
          uniqueDevicesMap.set(device.deviceId, {
            ...device,
            associatedProjects: [{ projectId: project.projectId, projectName: project.projectName }]
          });
        } else {
          // If the device is already noted, add this project to its list of associated projects
          existingDevice.associatedProjects.push({ projectId: project.projectId, projectName: project.projectName });
        }
      });
    });
  
    return Array.from(uniqueDevicesMap.values());
  };
  