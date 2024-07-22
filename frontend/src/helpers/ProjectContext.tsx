/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import { DeviceData, Device } from "../types/Device";
import {
  fetchFBAccounts,
  fetchDownloadHistory,
  fetchProject,
  fetchProjectDevices,
  fetchDeviceDetails,
} from "../hooks/projectServices";
import { Member } from "../types/Member";

interface ProjectContextProps {
  projectId: string;
  setProjectId: (arg0: string) => void;
  ownerName: string;
  setOwnerName: (arg0: string) => void;
  devices: DeviceData[];
  setDevices: (arg0: DeviceData[]) => void;
  startDate: Date;
  setStartDate: (arg0: Date) => void;
  downloadStartDate: Date;
  setDownloadStartDate: (arg0: Date) => void;
  downloadEndDate: Date;
  setDownloadEndDate: (arg0: Date) => void;
  fitbitAccounts: any[];
  showBackDrop: boolean;
  setShowBackDrop: (arg0: boolean) => void;
  selectedDevices: string[];
  setSelectedDevices: (arg0: string[]) => void;
  handleDeviceSelectionChange: (deviceId: string, isChecked: boolean) => void;
  detailLevel: string;
  setDetailLevel: (arg0: string) => void;
  fetchProject: () => void;
  projectDevices: any[];
  setProjectDevices: (arg0: Device[]) => void;
  fetchProjectDevices: () => void;
  project: Project;
  updateProject: (updates: Partial<Project>) => void;
  downloadHistory: any[];
  setDownloadHistory: (arg0: any[]) => void;
  fetchDeviceDetails: (deviceId: string) => any;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string;
  ownerId: string;
  ownerEmail: string;
  members: Member[];
  devices: Device[];
  isAdmin: boolean;
  isOwner: boolean;
  areNotificationsEnabled: boolean;
}

const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const defaultProject: Project = {
    projectId: "",
    projectName: "",
    projectDescription: "",
    ownerId: "",
    ownerEmail: "",
    members: [],
    devices: [],
    isAdmin: false,
    isOwner: false,
    areNotificationsEnabled: false,
  };

  const [project, setProject] = useState<Project>(defaultProject);
  const [projectId, setProjectId] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date("2024-02-09"));
  const [downloadStartDate, setDownloadStartDate] = useState(new Date());
  const [downloadEndDate, setDownloadEndDate] = useState(new Date());
  const [detailLevel, setDetailLevel] = useState<string>("1min");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [devices, setDevices] = useState<DeviceData[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );
  const [fitbitAccounts, setFitbitAccounts] = useState<any[]>([]);

  const [projectDevices, setProjectDevices] = useState<Device[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );

  const [downloadHistory, setDownloadHistory] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchDownloadHistory().then(setDownloadHistory);
    }
  }, [projectId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setProjectId(id);
    } else {
      console.log("No project ID found");
    }
  }, [window.location.search]);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId).then((data) => {
        if (data) {
          setProject(data);
          updateProject({ devices: data.devices });
          if (fitbitAccounts.length === 0) {
            fetchFBAccounts(projectId).then(setFitbitAccounts);
          }
        }
      });
    }
  }, [projectId]); // Add projectId as a dependency

  const updateProject = (updates: Partial<Project>) => {
    setProject((prevProject) => {
      return { ...prevProject, ...updates };
    });
  };

  const handleDeviceSelectionChange = (
    deviceId: string,
    isChecked: boolean
  ): void => {
    setSelectedDevices((prev) => {
      return isChecked
        ? [...prev, deviceId]
        : prev.filter((id) => id !== deviceId);
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projectId,
        setProjectId,
        devices,
        ownerName,
        setOwnerName,
        setDevices,
        fetchDeviceDetails: (deviceId) =>
          fetchDeviceDetails(project.devices, deviceId),
        project,
        startDate,
        setStartDate,
        downloadStartDate,
        setDownloadStartDate,
        downloadEndDate,
        setDownloadEndDate,
        showBackDrop,
        setShowBackDrop,
        selectedDevices,
        setSelectedDevices,
        handleDeviceSelectionChange,
        detailLevel,
        setDetailLevel,
        fetchProject: () =>
          fetchProject(projectId).then((data) => {
            if (data) {
              setProject(data);
              updateProject({ devices: data.devices });
              if (fitbitAccounts?.length === 0) {
                fetchFBAccounts(projectId).then(setFitbitAccounts);
              }
            }
          }),
        updateProject,
        projectDevices,
        fetchProjectDevices: () =>
          fetchProjectDevices(projectId).then(setProjectDevices),
        setProjectDevices,
        downloadHistory,
        setDownloadHistory,
        fitbitAccounts,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within an AuthProvider");
  }

  return context;
};

export { ProjectProvider, useProject };
