/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { OverviewDevice, DeviceData, Device } from "../types/Device";

interface ProjectContextProps {
  projectName: string;
  projectId: string;
  setProjectId: (arg0: string) => void;
  setOwnerEmail: (arg0: string) => void;
  ownerEmail: string;
  ownerName: string;
  ownerId: string;
  setOwnerName: (arg0: string) => void;
  setOwnerId: (arg0: string) => void;
  setprojectName: (arg0: string) => void;
  setMembers: (arg0: any[]) => void;
  members: any[];
  devices: DeviceData[];
  setDevices: (arg0: DeviceData[]) => void;
  deviceViewDevices: Device[];
  setDeviceViewDevices: (arg0: Device[]) => void;
  fetchDevices: () => void;
  startDate: Date;
  rangeStartDate: Date;
  rangeEndDate: Date;
  setStartDate: (arg0: Date) => void;
  setRangeStartDate: (arg0: Date) => void;
  setRangeEndDate: (arg0: Date) => void;
  downloadDate: Date;
  setDownloadDate: (arg0: Date) => void;
  showBackDrop: boolean;
  setShowBackDrop: (arg0: boolean) => void;
  selectedDevices: string[];
  setSelectedDevices: (arg0: string[]) => void;
  handleDeviceSelectionChange: (deviceId: string, isChecked: boolean) => void;
  devicesData: DeviceData[];
  detailLevel: string;
  setDetailLevel: (arg0: string) => void;
  fetchDevice: (deviceId: string) => void;
  isOwner: boolean;
  isAccountLinked: boolean;
  fetchProject: () => void;
  projectDevices: any[];
  fetchDeviceViewDevices: () => void;
  projectDescription: string;
  setProjectDescription: (arg0: string) => void;
  setProjectName: (arg0: string) => void;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const GET_PROJECT_ENDPOINT = `${import.meta.env.VITE_API_URL}/project/info`;
  const FETCH_DEVICE_DATA_ENDPOINT = `${import.meta.env.VITE_API_URL}/project/fetch-data`;
  const FETCH_PROJECT_DEVICES_ENDPOINT = `${import.meta.env.VITE_API_URL}/project/fetch-devices`;

  const [projectName, setprojectName] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [isOwner] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(new Date("2024-02-09"));
  const [rangeStartDate, setRangeStartDate] = useState(new Date("2024-02-10"));
  const [rangeEndDate, setRangeEndDate] = useState(new Date("2024-02-11"));
  const [downloadDate, setDownloadDate] = useState(new Date("2024-02-10"));
  const [detailLevel, setDetailLevel] = useState<string>("1min");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [isAccountLinked] = useState<boolean>(false);
  const [projectDevices, setProjectDevices] = useState<OverviewDevice[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );

  const [deviceViewDevices, setDeviceViewDevices] = useState<Device[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );

  /*
  const testDevices = [
    {
      id: "531590",
      name: "Device #1",
      deviceVersion: "Charge 4",
    },
    {
      id: "124811",
      name: "Device #2",
      deviceVersion: "Charge 4",
    },
  ];

  const testMembers = [
    {
      name: "John Doe",
      email: "johndoe831@gmail.com",
      role: "Owner",
    },
    {
      name: "Jane Doe",
      email: "janedoe831@gmail.com",
      role: "Member",
    },
    {
      name: "Brandon Le",
      email: "brandonle831@gmail.com",
      role: "Member",
    },
    {
      name: "Emily Zhang",
      email: "emilyzhang831@gmail.com",
      role: "Member",
    },
    {
      name: "Michael Smith",
      email: "michaelsmith831@gmail.com",
      role: "Admin",
    },
    {
      name: "Sara Connor",
      email: "saraconnor831@gmail.com",
      role: "Member",
    },
    {
      name: "Will Johnson",
      email: "willjohnson831@gmail.com",
      role: "Member",
    },
    {
      name: "Grace Lee",
      email: "gracelee831@gmail.com",
      role: "Member",
    },
    {
      name: "Samuel Jackson",
      email: "samueljackson831@gmail.com",
      role: "Member",
    },
    {
      name: "Lily Evans",
      email: "lilyevans831@gmail.com",
      role: "Member",
    },
    {
      name: "James Potter",
      email: "jamespotter831@gmail.com",
      role: "Member",
    },
    {
      name: "Olivia Rodrigo",
      email: "oliviarodrigo831@gmail.com",
      role: "Member",
    },
    {
      name: "Tony Stark",
      email: "tonystark831@gmail.com",
      role: "Member",
    },
    {
      name: "Bruce Wayne",
      email: "brucewayne831@gmail.com",
      role: "Member",
    },
    {
      name: "Clark Kent",
      email: "clarkkent831@gmail.com",
      role: "Admin",
    },
  ];*/

  useEffect(() => {
    // Check the URL parameters
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

  const fetchProject = async () => {
    try {
      const response = await axios.get(GET_PROJECT_ENDPOINT, {
        params: {
          projectId: projectId,
        },
        withCredentials: true,
      });

      const project = response.data.project;

      console.log(project.members);
      setMembers(project.members);
      setProjectDevices(project.devices);
      console.log("from ProjectContext: " + project.devices);
      setprojectName(project.projectName);
      setOwnerEmail(project.ownerEmail);
      setOwnerId(project.ownerId);
      setOwnerName(project.ownerName);
      setProjectDescription(
        project.projectDescription ? project.projectDescription : ""
      );

      console.log(response);
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
            console.log("no need to fetch data for: " + deviceId);
            return false;
          } else {
            console.log("need to fetch data for: " + deviceId);
            return true;
          }
        }
      }
    }
    console.log("need to fetch data for: " + deviceId);
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

        console.log(
          "searching through the previous devices data: " + devicesData
        );
        setDevicesData((prevDevicesData) => {
          console.log("previously was: " + prevDevicesData);

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
        //setDevicesData(testDevicesData);
      }
    }
  };

  useEffect(() => {
    if (selectedDevices.length > 0) {
      //setDevicesData([]);
      selectedDevices.forEach((deviceId) => {
        fetchDevice(deviceId);
      });
    }
  }, [rangeStartDate, rangeEndDate, selectedDevices]);

  const fetchDevices = async () => {
    try {
      for (const device of selectedDevices) {
        fetchDevice(device);
      }
    } catch (error) {
      console.error(error);
      //setDevicesData(testDevicesData);
    }
  };

  const fetchDeviceViewDevices = async () => {
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

      setDeviceViewDevices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projectName,
        projectId,
        setProjectId,
        members,
        devices,
        ownerEmail,
        ownerName,
        ownerId,
        setOwnerEmail,
        setOwnerName,
        setOwnerId,
        setprojectName,
        setMembers,
        setDevices,
        fetchDevices,
        deviceViewDevices,
        setDeviceViewDevices,
        startDate,
        rangeStartDate,
        rangeEndDate,
        setRangeStartDate,
        setStartDate,
        setRangeEndDate,
        downloadDate,
        setDownloadDate,
        showBackDrop,
        setShowBackDrop,
        selectedDevices,
        setSelectedDevices,
        handleDeviceSelectionChange,
        devicesData,
        detailLevel,
        setDetailLevel,
        fetchDevice,
        isOwner,
        isAccountLinked,
        fetchProject,
        projectDescription,
        setProjectDescription,
        projectDevices,
        fetchDeviceViewDevices,
        setProjectName,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { ProjectProvider, useProject };
