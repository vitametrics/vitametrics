/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

import { useOrg } from "./OrgContext";

interface DashboardProps {
  startDate: Date;
  rangeStartDate: Date;
  rangeEndDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setRangeStartDate: Dispatch<SetStateAction<Date>>;
  setRangeEndDate: Dispatch<SetStateAction<Date>>;
  showBackDrop: boolean;
  setShowBackDrop: (arg0: boolean) => void;
  selectedDevices: string[];
  setSelectedDevices: (arg0: string[]) => void;
  handleDeviceSelectionChange: (deviceId: string, isChecked: boolean) => void;
  devicesData: any[]; //temp any
}

interface DeviceContext {
  [deviceId: string]: {
    rangeStartDate: Date;
    rangeEndDate: Date;
  };
}

const DashboardContext = createContext<DashboardProps | undefined>(undefined);

const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const FETCH_DEVICE_DATA_ENDPOINT =
    import.meta.env.NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_DEVICE_DATA_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_DEVICE_DATA_DEV_ENDPOINT;

  const { devices } = useOrg();
  const [startDate, setStartDate] = useState(new Date()); // use `new Date()` instead of `Date.now()`
  const [rangeStartDate, setRangeStartDate] = useState(new Date());
  const [rangeEndDate, setRangeEndDate] = useState(new Date());
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>(
    devices.map((device) => device.id)
  );
  const [devicesData, setDevicesData] = useState<any[]>([]); //temp any
  const loadedDevicesRef = useRef<DeviceContext>({});

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

  const shouldFetchDeviceData = (deviceId: string) => {
    const loadedData = loadedDevicesRef.current[deviceId];
    return (
      !loadedData ||
      loadedData.rangeStartDate !== rangeStartDate ||
      loadedData.rangeEndDate !== rangeEndDate
    );
  };

  const fetchDevice = (deviceId: string) => {
    if (shouldFetchDeviceData(deviceId)) {
      try {
        axios
          .get(FETCH_DEVICE_DATA_ENDPOINT, {
            params: {
              id: deviceId,
              startDate: formatDate(rangeStartDate),
              endDate: formatDate(rangeEndDate),
            },
          })
          .then((res) => {
            console.log(res.data);
            setDevicesData((prev) => [...prev, res.data]);
            loadedDevicesRef.current[deviceId] = {
              rangeStartDate,
              rangeEndDate,
            };
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (selectedDevices.length > 0) {
      setDevicesData([]);
      selectedDevices.forEach((deviceId) => {
        fetchDevice(deviceId);
      });
    }
  }, [rangeStartDate, rangeEndDate, selectedDevices]);

  return (
    <DashboardContext.Provider
      value={{
        startDate,
        rangeStartDate,
        rangeEndDate,
        setRangeStartDate,
        setStartDate,
        setRangeEndDate,
        showBackDrop,
        setShowBackDrop,
        selectedDevices,
        setSelectedDevices,
        handleDeviceSelectionChange,
        devicesData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export { DashboardProvider, useDashboard };
