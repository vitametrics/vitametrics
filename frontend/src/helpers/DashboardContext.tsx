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
  detailLevel: string;
  setDetailLevel: Dispatch<SetStateAction<string>>;
  showBackDrop: boolean;
  setShowBackDrop: (arg0: boolean) => void;
  selectedDevices: string[];
  setSelectedDevices: (arg0: string[]) => void;
  handleDeviceSelectionChange: (deviceId: string, isChecked: boolean) => void;
  devicesData: any[]; //temp any
  deviceData: any[]; //temp any
}

interface DeviceData {
  rangeStartDate: Date;
  rangeEndDate: Date;
  data: any; // Detailed data for each device
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

  const FETCH_INTRADAY_DATA_ENDPOINT =
    import.meta.env.NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_INTRADAY_DATA_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_INTRADAY_DATA_DEV_ENDPOINT;

  const { devices } = useOrg();
  const [startDate, setStartDate] = useState(new Date("2024-02-10"));
  const [rangeStartDate, setRangeStartDate] = useState(new Date());
  const [rangeEndDate, setRangeEndDate] = useState(new Date());
  const [detailLevel, setDetailLevel] = useState<string>("1min");
  const [selectedDevices, setSelectedDevices] = useState<string[]>(
    devices.map((device) => device.id)
  );
  const [devicesData, setDevicesData] = useState<any[]>([]); //temp any
  const loadedDevicesRef = useRef<DeviceContext>({});
  const [deviceData, setDeviceData] = useState<any[]>([]); //temp any
  const [showBackDrop, setShowBackDrop] = useState(false);

  const saveDeviceDataToLocalStorage = (deviceId: string, data: DeviceData) => {
    localStorage.setItem(`deviceData_${deviceId}`, JSON.stringify(data));
  };

  /*
  const getDeviceDataFromLocalStorage = (
    deviceId: string
  ): DeviceData | undefined => {
    const data = localStorage.getItem(`deviceData_${deviceId}`);
    return data ? JSON.parse(data) : undefined;
  };
*/
  const fetchSingleViewDevice = (deviceId: string) => {
    //const deviceData = getDeviceDataFromLocalStorage(deviceId);
    console.log("fetching single device data");

    try {
      axios
        .get(FETCH_INTRADAY_DATA_ENDPOINT, {
          params: {
            id: deviceId,
            startDate: formatDate(rangeStartDate),
            endDate: formatDate(rangeEndDate),
            detailLevel,
          },
        })
        .then((res) => {
          console.log(res.data);
          const newDeviceData: DeviceData = {
            data: res.data,
            rangeStartDate: rangeStartDate,
            rangeEndDate: rangeEndDate,
          };
          setDeviceData((prev) => ({ ...prev, [deviceId]: newDeviceData }));
          saveDeviceDataToLocalStorage(deviceId, newDeviceData);
        });
    } catch (error) {
      console.log(error);
    }
  };

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
      console.log("fetching device data based on range date");
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

  useEffect(() => {
    if (selectedDevices.length > 0) {
      selectedDevices.forEach((deviceId) => {
        fetchSingleViewDevice(deviceId);
      });
    }
  }, [startDate, detailLevel]);

  useEffect(() => {
    devices.forEach((device) => {
      //console.log(device);
      fetchDevice(device.id);
      fetchSingleViewDevice(device.id);
    });
  }, [devices]);

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
        detailLevel,
        setDetailLevel,
        deviceData,
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
