/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface Member {
  distanceUnit: string;
  email: string;
  emailVerified: boolean;
  languageLocale: string;
  lastInviteSent: any; //fix this
  orgId: string;
  userId: string;
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

interface OrgContextProps {
  orgName: string;
  orgId: string;
  setOrgId: (arg0: string) => void;
  members: any[];
  devices: DeviceData[];
  setDevices: (arg0: DeviceData[]) => void;
  fetchOrg: () => void;
  fetchDataById: (id: string, startDate: string, endDate: string) => void;
  syncDevice: (id: string, start: Date, end: Date) => void;
  deviceViewDevices: Device[];
  setDeviceViewDevices: (arg0: Device[]) => void;
  fetchDevices: () => void;
}

const OrgContext = createContext<OrgContextProps | undefined>(undefined);

const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, logout } = useAuth();
  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );

  const testDeviceViewDevices = [
    {
      id: "2570612980",
      deviceVersion: "Alta HR",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 100,
      ownerName: "Brandon Le",
      mac: "123456789",
      type: "TRACKER",
    },
  ];

  const testDevices = [
    {
      id: "2570612980",
      name: "Brandon Le",
      deviceVersion: "Alta HR",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 100,
      steps: [
        {
          date: "2024-02-20",
          value: 9820,
        },
        {
          date: "2024-02-21",
          value: 4350,
        },
        {
          date: "2024-02-22",
          value: 1230,
        },
        {
          date: "2024-02-23",
          value: 6784,
        },
        {
          date: "2024-02-24",
          value: 8910,
        },
        {
          date: "2024-02-25",
          value: 13234,
        },
      ],
      vo2max: [
        {
          date: "2024-02-20",
          value: 50,
        },
        {
          date: "2024-02-21",
          value: 51,
        },
        {
          date: "2024-02-22",
          value: 54,
        },
        {
          date: "2024-02-23",
          value: 40,
        },
        {
          date: "2024-02-24",
          value: 46,
        },
        {
          date: "2024-02-25",
          value: 55,
        },
        {
          date: "2024-02-26",
          value: 50,
        },
        {
          date: "2024-02-27",
          value: 51,
        },
        {
          date: "2024-02-28",
          value: 54,
        },
        {
          date: "2024-02-29",
          value: 40,
        },
        {
          date: "2024-02-30",
          value: 46,
        },
      ],
      heart: [
        {
          date: "2024-02-20",
          value: 74,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 90,
        },
        {
          date: "2024-02-23",
          value: 95,
        },
        {
          date: "2024-02-24",
          value: 64.8,
        },
        {
          date: "2024-02-25",
          value: 80,
        },
        {
          date: "2024-02-26",
          value: 90,
        },
        {
          date: "2024-02-27",
          value: 120,
        },
      ],
      calories: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
      distance: [
        {
          date: "2024-02-20",
          value: 1200,
        },
        {
          date: "2024-02-21",
          value: 1020,
        },
        {
          date: "2024-02-22",
          value: 5000,
        },
      ],
      elevation: [
        {
          date: "2024-02-20",
          value: 1000,
        },
        {
          date: "2024-02-21",
          value: 1020,
        },
        {
          date: "2024-02-22",
          value: 1030,
        },
      ],
      floors: [
        {
          date: "2024-02-20",
          value: 100,
        },
        {
          date: "2024-02-21",
          value: 120,
        },
        {
          date: "2024-02-22",
          value: 1480,
        },
      ],
    },
    {
      id: "2570612417",
      deviceVersion: "Fitbit Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 10,
      name: "Angel Vazquez",
      steps: [
        {
          date: "2024-02-20",
          value: 3421,
        },
        {
          date: "2024-02-21",
          value: 5423,
        },
        {
          date: "2024-02-22",
          value: 2310,
        },
        {
          date: "2024-02-23",
          value: 7450,
        },
        {
          date: "2024-02-24",
          value: 9182,
        },
        {
          date: "2024-02-25",
          value: 12134,
        },
      ],
      vo2max: [
        {
          date: "2024-02-20",
          value: 64.8,
        },
        {
          date: "2024-02-21",
          value: 64.8,
        },
        {
          date: "2024-02-22",
          value: 64.8,
        },
        {
          date: "2024-02-23",
          value: 64.8,
        },
        {
          date: "2024-02-24",
          value: 64.8,
        },
        {
          date: "2024-02-25",
          value: 64.8,
        },
        {
          date: "2024-02-26",
          value: 64.8,
        },
        {
          date: "2024-02-27",
          value: 64.8,
        },
      ],
      heart: [
        {
          date: "2024-02-20",
          value: 74,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 90,
        },
        {
          date: "2024-02-23",
          value: 95,
        },
        {
          date: "2024-02-24",
          value: 64.8,
        },
        {
          date: "2024-02-25",
          value: 80,
        },
        {
          date: "2024-02-26",
          value: 90,
        },
        {
          date: "2024-02-27",
          value: 120,
        },
      ],
      calories: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
      distance: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
      elevation: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
      floors: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
    },
    {
      id: "2570612989",
      deviceVersion: "Playstation 5",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 100,
      name: "Sean Cornell",
      steps: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 12570,
        },
        {
          date: "2024-02-22",
          value: 6450,
        },
        {
          date: "2024-02-23",
          value: 11453,
        },
        {
          date: "2024-02-24",
          value: 8760,
        },
        {
          date: "2024-02-25",
          value: 3420,
        },
      ],
      vo2max: [
        {
          date: "2024-02-20",
          value: 50,
        },
        {
          date: "2024-02-21",
          value: 51,
        },
        {
          date: "2024-02-22",
          value: 54,
        },
        {
          date: "2024-02-23",
          value: 40,
        },
        {
          date: "2024-02-24",
          value: 46,
        },
        {
          date: "2024-02-25",
          value: 55,
        },
        {
          date: "2024-02-26",
          value: 50,
        },
        {
          date: "2024-02-27",
          value: 51,
        },
        {
          date: "2024-02-28",
          value: 54,
        },
        {
          date: "2024-02-29",
          value: 40,
        },
        {
          date: "2024-02-30",
          value: 46,
        },
      ],
      heart: [
        {
          date: "2024-02-20",
          value: 74,
        },
        {
          date: "2024-02-21",
          value: 110,
        },
        {
          date: "2024-02-22",
          value: 75,
        },
        {
          date: "2024-02-23",
          value: 95,
        },
        {
          date: "2024-02-24",
          value: 64.8,
        },
        {
          date: "2024-02-25",
          value: 80,
        },
        {
          date: "2024-02-26",
          value: 90,
        },
        {
          date: "2024-02-27",
          value: 140,
        },
      ],
      calories: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
      distance: [
        {
          date: "2024-02-20",
          value: 1200,
        },
        {
          date: "2024-02-21",
          value: 1020,
        },
        {
          date: "2024-02-22",
          value: 5000,
        },
      ],
      elevation: [
        {
          date: "2024-02-20",
          value: 1000,
        },
        {
          date: "2024-02-21",
          value: 1020,
        },
        {
          date: "2024-02-22",
          value: 1030,
        },
      ],
      floors: [
        {
          date: "2024-02-20",
          value: 100,
        },
        {
          date: "2024-02-21",
          value: 120,
        },
        {
          date: "2024-02-22",
          value: 1480,
        },
      ],
    },
  ];

  const [deviceViewDevices, setDeviceViewDevices] = useState<Device[]>(
    localStorage.getItem("devices")
      ? JSON.parse(localStorage.getItem("devices")!)
      : []
  );

  const AUTH_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_AUTH_ENDPOINT
      : import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;

  const FETCH_ORG_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_ORG_DEV_ENDPOINT;

  const SYNC_DEVICE_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_SYNC_DEVICE_ENDPOINT
      : import.meta.env.VITE_APP_SYNC_DEVICE_DEV_ENDPOINT;

  const FETCH_DEVICE_DATA_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_DEVICE_DATA_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_DEVICE_DATA_DEV_ENDPOINT;

  const FETCH_DEVICES_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_DEVICES_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_DEVICES_DEV_ENDPOINT;

  const fetchDataById = async (
    id: string,
    startDate: string,
    endDate: string
  ) => {
    if (!id) {
      return console.error("Device ID is required");
    }

    if (!startDate) {
      startDate = Date.now().toString();
    }

    if (!endDate) {
      endDate = Date.now().toString();
    }

    const dataType = "steps";

    const url = `${FETCH_DEVICE_DATA_ENDPOINT}`;
    //console.log(url);

    try {
      await axios.get(url, {
        params: {
          id,
          startDate,
          endDate,
          dataType,
        },
        withCredentials: true,
      });
      //console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month < 10 ? "0" + month : month}-${day}`;
  };

  const syncDevice = async (id: string, start: Date, end: Date) => {
    if (!id) {
      return console.error("Device ID is required");
    }

    const url = `${SYNC_DEVICE_ENDPOINT}`;

    const startDate = formatDate(start);
    const endDate = formatDate(end);

    try {
      await axios.get(url, {
        params: {
          id,
          startDate,
          endDate,
        },
        withCredentials: true,
      });
      //console.log(response.data);
      //console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDevices = async () => {
    try {
      const response = await axios.post(FETCH_DEVICES_ENDPOINT, {
        withCredentials: true,
      });

      if (!response.data) {
        return;
      }
      setDeviceViewDevices(response.data);

      localStorage.setItem("devices", JSON.stringify(response.data));
      setDevices(response.data);
    } catch (error) {
      setDevices(testDevices);
      setDeviceViewDevices(testDeviceViewDevices);
      console.log(error);
    }
  };
  const fetchOrg = async () => {
    try {
      const response = await axios.get(FETCH_ORG_ENDPOINT, {
        params: {
          orgId: orgId,
        },
        withCredentials: true,
      });

      setOrgName(response.data.organization.orgName);
      setMembers(response.data.members || []);
      //await fetchDevices();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const auth_response = await axios.get(AUTH_ENDPOINT, {
          withCredentials: true,
        });

        if (auth_response.data.isAuthenticated === false) {
          //console.log("User is not authenticated");
          logout();
        } else {
          await login();
          setOrgId(auth_response.data.user.orgId);
        }
      } catch (error) {
        console.error(error);
      }
    };

    initializeAuth();
  }, [login, logout]);

  useEffect(() => {
    const fetchOrgData = async () => {
      //console.log("fetching org " + orgId);
      try {
        const response = await axios.get(FETCH_ORG_ENDPOINT, {
          params: { orgId: orgId },
          withCredentials: true,
        });

        setOrgName(response.data.organization.orgName);
        setMembers(response.data.members || []);
        console.log(response.data);
        //await fetchDevices(); // Assuming fetchDevices doesn't depend on orgId directly
      } catch (error) {
        console.error(error);
      }
    };

    if (orgId) {
      fetchOrgData();
    }
  }, [orgId]); // Only re-run when orgId changes

  return (
    <OrgContext.Provider
      value={{
        orgName,
        orgId,
        setOrgId,
        members,
        devices,
        fetchOrg,
        fetchDataById,
        syncDevice,
        setDevices,
        fetchDevices,
        deviceViewDevices,
        setDeviceViewDevices,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};

const useOrg = () => {
  const context = useContext(OrgContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { OrgProvider, useOrg };
