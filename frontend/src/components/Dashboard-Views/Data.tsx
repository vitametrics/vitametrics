/* eslint-disable @typescript-eslint/no-explicit-any */
//import DatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useOrg } from "../../helpers/OrgContext";
import { Line, Bar, Pie, Scatter, Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // Importing auto registration of chart.js

type DataItem = {
  date: string;
  value: number;
};

const Data = () => {
  const DOWNLOAD_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_DOWNLOAD_DATA_ENDPOINT
      : import.meta.env.VITE_APP_DOWNLOAD_DATA_DEV_ENDPOINT;

  const [dataType, setDataType] = useState("heart_rate");
  const [graphType, setGraphType] = useState("bar");
  //const [graphType, setGraphType] = useState("Bar");

  const { devices, orgName, fetchDataById, syncDevice } = useOrg();

  //YYYY - MM - DD
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [detailLevel, setDetailLevel] = useState("1hour");

  const detailLevelTypes = [
    {
      value: "1sesc",
      label: "1 second",
    },
    {
      value: "1min",
      label: "1 minute",
    },
    {
      value: "15min",
      label: "15 minutes",
    },
    {
      value: "1hour",
      label: "1 hour",
    },
  ];

  useEffect(() => {
    const deviceIds = devices.map((device) => device.id);
    setSelectedDevices(deviceIds);
  }, []);

  const [chartData, setChartData] = useState({});

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

  useEffect(() => {
    const datasets = selectedDevices
      .map((deviceId) => {
        const device = devices.find((d) => d.id === deviceId);
        if (!device) return null; // Skip if device not found

        const label = device.deviceVersion + " " + device.id; // Use device ID as label
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
  }, [selectedDevices, dataType, startDate, endDate]);

  const handleDeviceSelectionChange = (
    deviceId: string,
    isChecked: boolean
  ) => {
    setSelectedDevices((prev) =>
      isChecked ? [...prev, deviceId] : prev.filter((id) => id !== deviceId)
    );
    //setDeviceId(deviceId); //for testing
  };

  /*
  const graphTypeOptions = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
  ];*/

  const renderGraph = () => {
    switch (graphType) {
      case "bar":
        return (
          <Bar
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true, maintainAspectRatio: false }}
            width="100%"
          />
        );
      case "line":
        return (
          <Line
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true, maintainAspectRatio: false }}
            width="100%"
          />
        );
      case "pie":
        return (
          <Pie
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true, maintainAspectRatio: false }}
            width="100%"
          />
        );
      case "doughnut":
        return (
          <Doughnut
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true, maintainAspectRatio: false }}
            width="100%"
          />
        );
      case "scatter":
        return (
          <Scatter
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true, maintainAspectRatio: false }}
            width="100%"
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

  const downloadData = async () => {
    if (selectedDevices.length === 0) {
      console.log("devices need to be selected");
      return;
    }

    const url = `${DOWNLOAD_ENDPOINT}`;
    for (let i = 0; i < selectedDevices.length; i++) {
      try {
        const id = selectedDevices[i];
        const response = await axios.get(url, {
          params: {
            id,
            dataType,
            startDate,
            detailLevel,
          },
          withCredentials: true,
        });

        console.log(response.data);

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
    }
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full h-full flex flex-col p-10 bg-[#1E1D20] dark:bg-hero-texture">
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0">
        {orgName} Overview
      </h2>
      <div className="flex flex-row p-5 w-full gap-5">
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

          <div className="flex flex-col">
            <label
              htmlFor="detailLevelType"
              className="block text-sm font-medium w-full text-white"
            >
              Select Detail Level:
            </label>
            <select
              id="detailLevelType"
              name="detailLevelType"
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="defaultDataType" disabled>
                -- Select Detail Level --
              </option>
              {detailLevelTypes.map((option) => (
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
        <div className="w-full h-[500px] p-5 text-white bg-[#2F2D2D] rounded-xl flex justify-center items-center mb-10">
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
                          className="w-9 h-[44px] mr-2  bg-gray-100 accent-[#606060] border-gray-300 rounded-xl focus:ring-transparent "
                        />
                        <p className="text-2xl font-bold text-white mr-auto ">
                          {device.deviceVersion} &nbsp;
                          {device.id}
                        </p>
                      </div>

                      <button
                        className="bg-none text-white border-white border-solid dark:border-transparent border-2 p-2 rounded-lg w-[60px] ml-auto"
                        onClick={() =>
                          fetchDataById(
                            device.id,
                            startDate || formatDate(new Date()),
                            endDate || formatDate(new Date())
                          )
                        }
                      >
                        Fetch
                      </button>
                      <button
                        className="bg-none text-white border-white dark:border-transparent border-solid border-2 p-2 rounded-lg w-[60px]"
                        onClick={() =>
                          syncDevice(
                            device.id,
                            startDate || new Date(),
                            endDate || new Date()
                          )
                        }
                      >
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

export default Data;
