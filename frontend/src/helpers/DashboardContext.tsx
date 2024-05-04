/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  //useRef,
} from "react";
import axios from "axios";

//import { useOrg } from "./OrgContext";

interface DashboardProps {
  startDate: Date;
  rangeStartDate: Date;
  rangeEndDate: Date;
  downloadDate: Date;
  setDownloadDate: Dispatch<SetStateAction<Date>>;
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
  devicesData: DeviceData[]; //temp any
  fetchDevice: (deviceId: string) => void;
  fetchDevices: () => void;
}

/*
interface DeviceContext {
  [deviceId: string]: {
    rangeStartDate: Date;
    rangeEndDate: Date;
  };
}*/

interface DeviceInfo {
  battery: string;
  batteryLevel: number;
  deviceVersion: string;
  features: string[];
  id: string;
}

interface HeartData {
  dateTime: string;
  value: {
    customHeartRateZones: any[];
    heartRateZones: any[];
    restingHeartRate: number;
  };
}

interface DataItem {
  dateTime: string;
  value: string;
}

interface DeviceData {
  [x: string]: any;
  deviceId: string;
  deviceInfo: DeviceInfo;
  heartData: HeartData[];
  stepsData: DataItem[];
  floorsData: DataItem[];
  distanceData: DataItem[];
  elevationData: DataItem[];
  caloriesData: DataItem[];
}

const DashboardContext = createContext<DashboardProps | undefined>(undefined);

const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const FETCH_DEVICE_DATA_ENDPOINT =
    "https://vitametrics.org/api/org/fetch-data";
  /*
    import.meta.env.NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_DEVICE_DATA_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_DEVICE_DATA_DEV_ENDPOINT; */

  /*const FETCH_INTRADAY_DATA_ENDPOINT =
    "https://vitametrics.org/api/org/fetch-intraday";*/

  /*
  const testDevicesData: DeviceData[] = [
    {
      deviceId: "2570612980",
      deviceInfo: {
        battery: "Medium",
        batteryLevel: 59,
        deviceVersion: "Alta HR",
        features: [],
        id: "2570612980",
      },
      heartData: [
        {
          dateTime: "2024-02-09",
          value: {
            customHeartRateZones: [],
            heartRateZones: [
              {
                caloriesOut: 578.88462,
                max: 98,
                min: 30,
                minutes: 376,
                name: "Out of Range",
              },
              {
                caloriesOut: 49.83132,
                max: 137,
                min: 98,
                minutes: 9,
                name: "Fat Burn",
              },
              {
                caloriesOut: 0,
                max: 166,
                min: 137,
                minutes: 0,
                name: "Cardio",
              },
              {
                caloriesOut: 37.751,
                max: 220,
                min: 166,
                minutes: 3,
                name: "Peak",
              },
            ],
            restingHeartRate: 53,
          },
        },
        {
          dateTime: "2024-02-10",
          value: {
            customHeartRateZones: [],
            heartRateZones: [
              {
                caloriesOut: 578.88462,
                max: 98,
                min: 30,
                minutes: 376,
                name: "Out of Range",
              },
              {
                caloriesOut: 49.83132,
                max: 137,
                min: 98,
                minutes: 9,
                name: "Fat Burn",
              },
              {
                caloriesOut: 0,
                max: 166,
                min: 137,
                minutes: 0,
                name: "Cardio",
              },
              {
                caloriesOut: 37.751,
                max: 220,
                min: 166,
                minutes: 3,
                name: "Peak",
              },
            ],
            restingHeartRate: 69,
          },
        },
      ],
      stepsData: [
        { dateTime: "2024-02-09", value: "1000" },
        { dateTime: "2024-02-10", value: "2000" },
      ],
    },
  ];*/

  //const { deviceViewDevices } = useOrg();
  const [startDate, setStartDate] = useState(new Date("2024-02-09"));
  const [rangeStartDate, setRangeStartDate] = useState(new Date("2024-02-10"));
  const [rangeEndDate, setRangeEndDate] = useState(new Date("2024-02-11"));
  const [downloadDate, setDownloadDate] = useState(new Date("2024-02-10"));
  const [detailLevel, setDetailLevel] = useState<string>("1min");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const [devicesData, setDevicesData] = useState<DeviceData[]>(() => {
    try {
      // Using a lazy initializer to only perform this operation once
      const data = localStorage.getItem("devicesData");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load devices data from localStorage:", error);
      return []; // Return empty array if there is an error
    }
  });

  useEffect(() => {
    localStorage.setItem("devicesData", JSON.stringify(devicesData));
  }, [devicesData]);

  //const loadedDevicesRef = useRef<DeviceContext>({});
  const [showBackDrop, setShowBackDrop] = useState(false);

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

  /*
  const shouldFetchDeviceData = (deviceId: string) => {
    const loadedData = loadedDevicesRef.current[deviceId];
    return (
      !loadedData ||
      loadedData.rangeStartDate !== rangeStartDate ||
      loadedData.rangeEndDate !== rangeEndDate
    );
  };*/

  const shouldFetchDevice = (deviceId: string) => {
    for (const device of devicesData) {
      console.log(device); //this works -- it outputs a device
      if (device) {
        console.log("from prev devices: " + device.deviceId);
        if (device.deviceId === deviceId) {
          console.log("found the device id: " + deviceId);

          //check if the date range is the same or within the range
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
        console.log("from prev devices: " + device.deviceId);
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
        //console.log("fetched device range data for: " + deviceId);
        //setDevicesData((prev) => [...prev, response.data]);
        //update current id in devicesData
        const newDeviceData = response.data;

        /*
      const deviceIndex = devicesData.findIndex(
        (device) => device.deviceId === deviceId
      );
      console.log("deviceIndex: " + deviceIndex);

      if (deviceIndex !== -1) {
        const newDevicesData = [...devicesData];
        newDevicesData[deviceIndex] = newDeviceData;
        setDevicesData(newDevicesData);
      } else {
        setDevicesData((prev) => [...prev, newDeviceData]);
      }

      console.log("setting local storage");
      localStorage.setItem("devicesData", JSON.stringify(devicesData));*/

        console.log(
          "searching through the previous devices data: " + devicesData
        );
        setDevicesData((prevDevicesData) => {
          console.log("previously was: " + prevDevicesData);

          let existingIndex = -1;

          for (const device of prevDevicesData) {
            console.log(device); //this works -- it outputs a device
            if (device) {
              console.log("from prev devices: " + device.deviceId);
              if (device.deviceId === deviceId) {
                console.log("found the device id: " + deviceId);
                existingIndex++;
                break;
              }
              console.log("from prev devices: " + device.deviceId);
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

  /*
  useEffect(() => {
    deviceViewDevices.forEach((device) => {
      fetchDevice(device.id);
      //fetchSingleViewDevice(device.id);
    });
  }, [deviceViewDevices]);*/

  return (
    <DashboardContext.Provider
      value={{
        startDate,
        rangeStartDate,
        rangeEndDate,
        setRangeStartDate,
        downloadDate,
        setDownloadDate,
        fetchDevices,
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
        fetchDevice,
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
