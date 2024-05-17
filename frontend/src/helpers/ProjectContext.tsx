/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Member {
  distanceUnit: string;
  email: string;
  emailVerified: boolean;
  languageLocale: string;
  lastInviteSent: any; //fix this
  projectId: string;
  userId: string;
}

interface HeartData {
  dateTime: string;
  value: {
    customHeartRateZones: any[];
    heartRateZones: any[];
    restingHeartRate: number;
  };
}
interface DeviceInfo {
  battery: string;
  batteryLevel: number;
  deviceVersion: string;
  features: string[];
  id: string;
}

interface DataItem {
  dateTime: string;
  value: string;
}

interface DeviceData {
  deviceId: string;
  deviceInfo: DeviceInfo;
  heartData: HeartData[];
  stepsData: DataItem[];
  floorsData: DataItem[];
  distanceData: DataItem[];
  elevationData: DataItem[];
  caloriesData: DataItem[];
}

interface DeviceData {
  id: string;
  name: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  [key: string]: any; // This line is the index signature
}

interface Device {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  ownerName: string;
  mac: string;
  type: string;
}

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
  deviceIds: string[];
  setDeviceIds: (arg0: string[]) => void;
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
  description: string;
  setDescription: (arg0: string) => void;
  projectDevices: any[];
}

const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projectName, setprojectName] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [isOwner] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [deviceIds, setDeviceIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date("2024-02-09"));
  const [rangeStartDate, setRangeStartDate] = useState(new Date("2024-02-10"));
  const [rangeEndDate, setRangeEndDate] = useState(new Date("2024-02-11"));
  const [downloadDate, setDownloadDate] = useState(new Date("2024-02-10"));
  const [detailLevel, setDetailLevel] = useState<string>("1min");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [isAccountLinked] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [projectDevices, setProjectDevices] = useState<any[]>([]);
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
  const testDescription = "No description provided";

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
  ];

  const GET_PROJECT_ENDPOINT =
    import.meta.env.NODE_ENV === "production"
      ? import.meta.env.VITE_APP_GET_PROJECT_ENDPOINT
      : import.meta.env.VITE_APP_GET_PROJECT_DEV_ENDPOINT;

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
      //setMembers(response.data.members);

      setMembers(project.members);
      setProjectDevices(testDevices);
      //setDevices(project.devices);
      setprojectName(project.projectName);
      setOwnerEmail(project.ownerEmail);
      setOwnerId(project.ownerId);
      setOwnerName(project.ownerName);
      setDeviceIds(project.devices.map((device) => device.id));
      setDescription(
        project.description ? project.description : testDescription
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_DEVICE_DATA_ENDPOINT =
    "https://vitametrics.org/api/org/fetch-data";

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
        //console.log("fetched device range data for: " + deviceId);
        //setDevicesData((prev) => [...prev, response.data]);
        //update current id in devicesData
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
        deviceIds,
        setDeviceIds,
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
        description,
        setDescription,
        projectDevices,
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
