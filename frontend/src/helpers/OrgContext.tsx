/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface DeviceData {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  steps: { date: string; value: number }[];
  vo2max: { date: string; value: number }[];
  heart_rate: { date: string; value: number }[];
  [key: string]: any; // This line is the index signature
}

interface OrgContextProps {
  orgName: string;
  orgId: string;
  setOrgId: (arg0: string) => void;
  members: any[];
  devices: DeviceData[];
  setDevices: (arg0: []) => void;
  fetchOrg: () => void;
  fetchDataById: (id: string, startDate: string, endDate: string) => void;
  syncDevice: (id: string, start: Date, end: Date) => void;
}

const OrgContext = createContext<OrgContextProps | undefined>(undefined);

const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, logout } = useAuth();
  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);

  const testDevices = [
    {
      id: "2570612980",
      deviceVersion: "Alta HR",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 100,
      steps: [
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
      heart_rate: [
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
    },
    {
      id: "2570612417",
      deviceVersion: "Fitbit Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 10,
      steps: [
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
      heart_rate: [
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
    },
  ];

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
    console.log(url);

    try {
      const response = await axios.get(url, {
        params: {
          id,
          startDate,
          endDate,
          dataType,
        },
        withCredentials: true,
      });
      console.log(response.data);
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
      const response = await axios.get(url, {
        params: {
          id,
          startDate,
          endDate,
        },
        withCredentials: true,
      });
      console.log(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDevices = async () => {
    console.log("fetching devices from " + FETCH_DEVICES_ENDPOINT);
    try {
      const response = await axios.post(FETCH_DEVICES_ENDPOINT, {
        withCredentials: true,
      });

      console.log(response.data);
      setDevices(response.data);
    } catch (error) {
      setDevices(testDevices);
      console.log(error);
    }
  };
  const fetchOrg = async () => {
    console.log("fetching org " + orgId);
    try {
      const response = await axios.get(FETCH_ORG_ENDPOINT, {
        params: {
          orgId: orgId,
        },
        withCredentials: true,
      });

      console.log(response.data);
      setOrgName(response.data.organization.orgName);
      console.log(response.data);
      //setDevices(response.data.organization.devices);
      setMembers(response.data.members || []);
      await fetchDevices();
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
          console.log("User is not authenticated");
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
      console.log("fetching org " + orgId);
      try {
        const response = await axios.get(FETCH_ORG_ENDPOINT, {
          params: { orgId: orgId },
          withCredentials: true,
        });

        setOrgName(response.data.organization.orgName);
        setMembers(response.data.members || []);
        await fetchDevices(); // Assuming fetchDevices doesn't depend on orgId directly
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
