/* eslint-disable @typescript-eslint/no-explicit-any */
//import DatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { Line, Bar, Pie, Scatter, Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // Importing auto registration of chart.js

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

type DataItem = {
  date: string;
  value: number;
};

const DataDemo = () => {
  //const DOWNLOAD_ENDPOINT = import.meta.env.VITE_APP_DOWNLOAD_DATA_ENDPOINT;
  const [dataType, setDataType] = useState("heart_rate");
  const [graphType, setGraphType] = useState("bar");

  const orgName = "Ada Lovelace's Org";
  const devices: DeviceData[] = [
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

  const [startDate, setStartDate] = useState(null); //YYYY - MM - DD
  const [endDate, setEndDate] = useState(null);
  //const [deviceId, setDeviceId] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  useEffect(() => {
    const deviceIds = devices.map((device) => device.id);
    setSelectedDevices(deviceIds);
  }, []);

  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const datasets = selectedDevices
      .map((deviceId) => {
        const device = devices.find((d) => d.id === deviceId);
        if (!device) return null; // Skip if device not found

        const label = device.id; // Use device ID as label
        const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color for each dataset
        const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color for each dataset
        const data = device?.[dataType]?.map((item: DataItem) => item.value);

        return {
          label,
          data,
          borderColor,
          backgroundColor,
          tension: 0.1,
          fill: false,
        };
      })
      .filter((dataset) => dataset !== null); // Filter out null datasets

    const labels =
      devices[0]?.[dataType]?.map((item: DataItem) => item.date) || [];

    setChartData({
      labels, // Use dates from the first device as labels
      datasets,
    });
  }, [selectedDevices, dataType]);

  const handleDeviceSelectionChange = (
    deviceId: string,
    isChecked: boolean
  ) => {
    setSelectedDevices((prev) =>
      isChecked ? [...prev, deviceId] : prev.filter((id) => id !== deviceId)
    );
    //setDeviceId(deviceId); //for testing
  };

  const dataTypeOptions = [
    { value: "heart_rate", label: "Heart Rate" },
    { value: "vo2max", label: "VO2 Max" },
    { value: "steps", label: "Steps" },
  ];

  const graphTypeOptions = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
    { value: "doughnut", label: "Doughnut" },
    { value: "scatter", label: "Scatter" },
  ];

  /*
  const graphTypeOptions = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
  ];*/

  const downloadData = async () => {
    /*
    if (!deviceId) {
      console.error("Device ID is required");
      return;
    }

    const url = `${DOWNLOAD_ENDPOINT}`;


    // Create a URL for the blob
     const downloadURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = downloadURL;
      link.setAttribute("download", "device-data.csv"); // or any other extension
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
    */
  };

  /*

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };*/

  const renderGraph = () => {
    switch (graphType) {
      case "bar":
        return (
          <Bar
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true }}
          />
        );
      case "line":
        return (
          <Line
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true }}
          />
        );
      case "pie":
        return (
          <Pie
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true }}
          />
        );
      case "doughnut":
        return (
          <Doughnut
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true }}
          />
        );
      case "scatter":
        return (
          <Scatter
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true }}
          />
        );

      default:
        return (
          <Bar
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true }}
          />
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-10 bg-hero-texture">
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0">
        {orgName} Overview
      </h2>
      <div className="flex flex-row p-5 w-full">
        {/* Data & Graph Type Dropdown */}
        <div className="mr-auto flex flex-row gap-5">
          <div className="flex flex-col">
            <label
              htmlFor="dataType"
              className="block text-sm font-medium  text-white"
            >
              Select Data Type:
            </label>
            <select
              id="dataType"
              name="dataType"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="defaultDataType" disabled>
                -- Select Data Type --
              </option>
              {dataTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="graphType"
              className="block text-sm font-medium  text-white"
            >
              Select Graph Type:
            </label>
            <select
              id="graphType"
              name="graphType"
              value={graphType}
              onChange={(e) => setGraphType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="defaultGraphType" disabled>
                -- Select Graph Type --
              </option>
              {graphTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-row w-full gap-5">
          <div className="ml-auto">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium  text-white"
            >
              Select Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(e: React.SetStateAction<any>) => setStartDate(e)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className=" p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium  text-white"
            >
              Select End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(e: React.SetStateAction<any>) => setEndDate(e)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>
      </div>
      <div className="p-5 w-full">
        <div className="w-full h-[500px] p-10 text-white bg-[#2F2D2D] rounded-xl flex justify-center items-center mb-10">
          {renderGraph()}
        </div>
        <div className="w-full h-[400px] text-white bg-[#2F2D2D] rounded-xl flex flex-col mb-10">
          <h2 className="text-center w-full text-white p-5 text-4xl">
            Devices
          </h2>
          <div className="flex flex-row justify-between h-full w-full p-5 gap-5">
            {devices.length > 0 ? (
              devices.map(
                (
                  device: {
                    id: string;
                    deviceVersion: string;
                    lastSyncTime: string;
                    batteryLevel: number;
                  },
                  index: number
                ) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row gap-5 items-center w-full h-[70px] bg-[#434040] p-5 rounded-xl"
                    >
                      <div className="flex flex-row mr-3 items-center justify-center">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleDeviceSelectionChange(
                              device.id,
                              e.target.checked
                            )
                          }
                          checked={selectedDevices.includes(device.id)}
                          className="w-9 h-[44px] mr-2 bg-gray-100 accent-[#2a2a2a] border-gray-300 rounded-xl focus:ring-transparent "
                        />
                        <p className="text-2xl font-bold text-white mr-auto ">
                          {device.id}
                        </p>
                      </div>

                      <button className="bg-none text-white border-white border-solid dark:border-transparent border-2 p-2 rounded-lg w-[60px] ml-auto">
                        Fetch
                      </button>
                      <button className="bg-none text-white border-white dark:border-transparent border-solid border-2 p-2 rounded-lg w-[60px]">
                        Sync
                      </button>
                    </div>
                  );
                }
              )
            ) : (
              <div className="text-center items-center w-full h-full">
                {" "}
                No Devices Found
              </div>
            )}
          </div>
        </div>
        <button
          className="p-5 text-2xl rounded-xl w-[250px] bg-[#606060] text-white"
          onClick={() => downloadData()}
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default DataDemo;
