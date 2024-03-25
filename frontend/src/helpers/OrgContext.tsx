/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface OrgContextProps {
  orgName: string;
  orgId: string;
  setOrgId: (arg0: string) => void;
  members: any[];
  devices: any[];
  fetchOrg: () => void;
  fetchDataById: (id: string, startDate: string, endDate: string) => void;
  syncDevice: (id: string, start: Date, end: Date) => void;
}

const OrgContext = createContext<OrgContextProps | undefined>(undefined);

const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, logout, isAuthenticated } = useAuth();
  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  const testDevices = [
    {
      device_id: "1234",
      device_type: "Fitbit",
      last_sync_date: "2021-10-10",
      battery_level: 50,
      steps: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 10000,
        },
        {
          date: "2024-02-22",
          value: 10000,
        },
      ],
      heart_rate: [
        {
          date: "2024-02-20",
          value: 100,
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
      device_id: "5678",
      device_type: "Fitbit",
      last_sync_date: "2021-10-10",
      battery_level: 50,
      steps: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 10000,
        },
        {
          date: "2024-02-22",
          value: 10000,
        },
      ],
      heart_rate: [
        {
          date: "2024-02-20",
          value: 100,
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
      const response = await axios.get(FETCH_DEVICES_ENDPOINT, {
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

  const authResponse = async () => {
    try {
      const auth_response = await axios.get(AUTH_ENDPOINT, {
        withCredentials: true,
      });

      if (auth_response.data.isAuthenticated === false) {
        console.log("User is not authenticated");
        logout();
        return;
      }

      await login();
      setOrgId(auth_response.data.user.orgId);
      console.log(orgId);
      console.log(auth_response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    authResponse();
    fetchOrg();
    fetchDevices();
  }, [orgId, isAuthenticated]);

  /*
  useEffect(() => {
    authResponse();
    setDevices(devices);
    fetchOrg();
  }, [isAuthenticated]);
*/
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
