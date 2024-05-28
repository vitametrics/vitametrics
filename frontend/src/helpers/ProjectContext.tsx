/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { DeviceData, Device } from "../types/Device";

interface ProjectContextProps {
  projectId: string;
  setProjectId: (arg0: string) => void;
  ownerName: string;
  setOwnerName: (arg0: string) => void;
  devices: DeviceData[];
  setDevices: (arg0: DeviceData[]) => void;
  //fetchDevices: () => void;
  startDate: Date;
  rangeStartDate: Date;
  rangeEndDate: Date;
  setStartDate: (arg0: Date) => void;
  setRangeStartDate: (arg0: Date) => void;
  setRangeEndDate: (arg0: Date) => void;
  downloadStartDate: Date;
  setDownloadStartDate: (arg0: Date) => void;
  downloadEndDate: Date;
  setDownloadEndDate: (arg0: Date) => void;

  showBackDrop: boolean;
  setShowBackDrop: (arg0: boolean) => void;
  selectedDevices: string[];
  setSelectedDevices: (arg0: string[]) => void;
  handleDeviceSelectionChange: (deviceId: string, isChecked: boolean) => void;
  devicesData: DeviceData[];
  detailLevel: string;
  setDetailLevel: (arg0: string) => void;
  fetchDevice: (deviceId: string) => void;
  isAccountLinked: boolean;
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
  members: any[];
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

  const GET_PROJECT_ENDPOINT = `${process.env.API_URL}/project/info`;
  const FETCH_DEVICE_DATA_ENDPOINT = `${process.env.API_URL}/project/fetch-data`;
  const FETCH_PROJECT_DEVICES_ENDPOINT = `${process.env.API_URL}/project/fetch-devices`;
  const [project, setProject] = useState<Project>(defaultProject);
  const [projectId, setProjectId] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date("2024-02-09"));
  const [rangeStartDate, setRangeStartDate] = useState(new Date("2024-02-10"));
  const [rangeEndDate, setRangeEndDate] = useState(new Date("2024-02-11"));

  const [downloadStartDate, setDownloadStartDate] = useState(
    new Date("2024-02-10")
  );
  const [downloadEndDate, setDownloadEndDate] = useState(
    new Date("2024-02-11")
  );
  const [detailLevel, setDetailLevel] = useState<string>("1min");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [isAccountLinked, setIsAccountLinked] = useState<boolean>(false);
  const [devices, setDevices] = useState<DeviceData[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );

  const [projectDevices, setProjectDevices] = useState<Device[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );

  // const testDevices = [
  //   {
  //     deviceId: "2570612980",
  //     deviceName: "Alta HR",
  //     deviceVersion: "Alta HR",
  //     lastSyncTime: "2024-02-10T00:00:00.000Z",
  //     batteryLevel: "4",
  //   },
  // ];

  const [downloadHistory, setDownloadHistory] = useState<any[]>([]);
  const DOWNLOAD_HISTORY_ENDPOINT = `${process.env.API_URL}/project/get-cached-files`;

  const fetchDownloadHistory = async () => {
    try {
      const response = await axios.get(DOWNLOAD_HISTORY_ENDPOINT, {
        withCredentials: true,
      });
      setDownloadHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchDownloadHistory();
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
      fetchProject();
    }
  }, [projectId]); // Add projectId as a dependency

  const updateProject = (updates: Partial<Project>) => {
    setProject((prevProject) => {
      return { ...prevProject, ...updates };
    });
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(GET_PROJECT_ENDPOINT, {
        params: {
          projectId: projectId,
        },
        withCredentials: true,
      });
      setProject(response.data.project);
      //update with tempDevices
      updateProject({
        devices: response.data.project.devices,
      });
      setIsAccountLinked(response.data.isAccountLinked);
    } catch (error) {
      console.log(error);
    }
  };

  const [devicesData, setDevicesData] = useState<DeviceData[]>(() => {
    try {
      const data = localStorage.getItem("devicesData");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load devices data from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("devicesData", JSON.stringify(devicesData));
  }, [devicesData]);

  const formatDate = (date: Date) => {
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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

  const shouldFetchDevice = (deviceId: string) => {
    for (const device of devicesData) {
      if (device) {
        if (device.deviceId === deviceId) {
          const deviceStartDate = new Date(device.stepsData[0].dateTime);
          const deviceEndDate = new Date(
            device.stepsData[device.stepsData.length - 1].dateTime
          );

          if (
            deviceStartDate <= rangeStartDate &&
            deviceEndDate >= rangeEndDate
          ) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
    return true;
  };

  const fetchDevice = async (deviceId: string) => {
    if (shouldFetchDevice(deviceId)) {
      try {
        const startDate = formatDate(rangeStartDate);
        const endDate = formatDate(rangeEndDate);

        const response = await axios.get(FETCH_DEVICE_DATA_ENDPOINT, {
          params: {
            id: deviceId,
            startDate: startDate,
            endDate: endDate,
          },
          withCredentials: true,
        });

        console.log(response.data);
        const newDeviceData = response.data;

        setDevicesData((prevDevicesData) => {
          let existingIndex = -1;

          for (const device of prevDevicesData) {
            console.log(device); //this works -- it outputs a device
            if (device) {
              console.log("from prev devices: " + device[0].deviceId);
              if (device[0].deviceId === deviceId) {
                console.log("found the device id: " + deviceId);
                existingIndex++;
                break;
              }
            }
          }

          if (existingIndex !== -1) {
            const updatedDevicesData = [...prevDevicesData];
            updatedDevicesData[existingIndex] = newDeviceData;
            localStorage.setItem(
              "devicesData",
              JSON.stringify(updatedDevicesData)
            );
            return updatedDevicesData;
          } else {
            const updatedDevicesData = [...prevDevicesData, newDeviceData];
            localStorage.setItem(
              "devicesData",
              JSON.stringify(updatedDevicesData)
            );
            return updatedDevicesData;
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchProjectDevices = async () => {
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

      setProjectDevices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeviceDetails = (deviceId: string) => {
    const device = project.devices.find(
      (device) => device.deviceId === deviceId
    );

    return device ? device : "Device not found";
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
        //fetchDevices,
        fetchDeviceDetails,
        project,
        startDate,
        rangeStartDate,
        rangeEndDate,
        setRangeStartDate,
        setStartDate,
        setRangeEndDate,
        downloadStartDate,
        setDownloadStartDate,
        downloadEndDate,
        setDownloadEndDate,
        showBackDrop,
        setShowBackDrop,
        selectedDevices,
        setSelectedDevices,
        handleDeviceSelectionChange,
        devicesData,
        detailLevel,
        setDetailLevel,
        fetchDevice,
        isAccountLinked,
        fetchProject,
        updateProject,
        projectDevices,
        fetchProjectDevices,
        setProjectDevices,
        downloadHistory,
        setDownloadHistory,
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
