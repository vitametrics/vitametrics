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

type DeviceData = {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  heart: DataItem[];
  steps: DataItem[];
  calories: DataItem[];
  distance: DataItem[];
  elevation: DataItem[];
  floors: DataItem[];
  [key: string]: any; // This line is the index signature
};

const Data = () => {
  const DOWNLOAD_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_DOWNLOAD_DATA_ENDPOINT
      : import.meta.env.VITE_APP_DOWNLOAD_DATA_DEV_ENDPOINT;

  const [dataType, setDataType] = useState("heart");
  const [graphType, setGraphType] = useState("bar");
  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadFlag, setDownloadFlag] = useState(false);

  const { devices, orgName } = useOrg();

  const [startDate, setStartDate] = useState(new Date()); //YYYY - MM - DD
  const [selectedDevices, setSelectedDevices] = useState<string[]>(
    devices.map((device) => device.id)
  );

  const [detailLevel, setDetailLevel] = useState("1min");

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
      value: "5min",
      label: "5 minutes",
    },
    {
      value: "15min",
      label: "15 minutes",
    },
  ];

  const [chartData, setChartData] = useState({});

  const dataTypeOptions = [
    { value: "heart", label: "Heart Rate" },
    { value: "steps", label: "Steps" },
    { value: "calories", label: "Calories" },
    { value: "distance", label: "Distance" },
    { value: "elevation", label: "Elevation" },
    { value: "floors", label: "Floors" },
  ];

  const graphTypeOptions = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
    { value: "doughnut", label: "Doughnut" },
    { value: "scatter", label: "Scatter" },
  ];

  /*
  useEffect(() => {
    const datasets = selectedDevices
      .map((deviceId) => {
        const device = devices.find((d) => d.id === deviceId);
        if (!device) return null; // Skip if device not found

        const date = formatDate(startDate);

        const label = device.deviceVersion + " " + device.id; // Use device ID as label
        const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color for each dataset
        const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color for each dataset

        const dataPoint = device[dataType]?.find(
          (item: DataItem) => item.date === date
        );
        return dataPoint ? dataPoint.value : null; // Return the value or null if not found
      });

        return {
          label,
          data: [dataPoint ? dataPoint.value : null], // Single data point
          borderColor,
          backgroundColor,
          tension: 0.1,
          fill: false,
        };
      })
      .filter((dataset) => dataset !== null); // Filter out null datasets

    //const labels = devices[0]?.map((item: DeviceData) => item.deviceVersion);
    console.log(devices);
    const labels = selectedDevices.map((deviceId) => {
      const device = devices.find((d) => d.id === deviceId);
      return device ? device.deviceVersion : "Unknown";
    }); //console.log(labels);

    setChartData({
      labels, // Use dates from the first device as labels
      datasets,
    });
  }, [selectedDevices, dataType, startDate, devices]);
*/
  useEffect(() => {
    const formattedDate = formatDate(startDate);

    // Generate labels from the selected devices' versions
    const labels = selectedDevices.map((deviceId) => {
      const device = devices.find((d) => d.id === deviceId);
      return device ? device.deviceVersion : "Unknown";
    });

    // Generate datasets, assuming one dataset for each device
    const datasets = selectedDevices
      .map((deviceId, index) => {
        const device = devices.find((d) => d.id === deviceId);
        if (!device) return null;

        const dataPoint = device[dataType]?.find(
          (item: DeviceData) => item.date === formattedDate
        );

        if (!dataPoint) return null; // No data point for this date, skip

        // Assign a color for this dataset
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        return {
          label: device.deviceVersion, // Label for the legend
          data: [{ x: labels[index], y: dataPoint.value }], // Format required for Chart.js v3
          backgroundColor: color,
          fill: true,
          barPercentage: 1,
          categoryPercentage: 1,
        };
      })
      .filter((dataset) => dataset !== null); // Remove any datasets without data

    console.log(labels);
    console.log(datasets);
    setChartData({
      labels, // Labels for the x-axis
      datasets,
    });
  }, [selectedDevices, dataType, startDate, devices]);

  const handleDeviceSelectionChange = (
    deviceId: string,
    isChecked: boolean
  ) => {
    setSelectedDevices((prev) =>
      isChecked ? [...prev, deviceId] : prev.filter((id) => id !== deviceId)
    );
  };

  const renderGraph = () => {
    /*
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      /*
      scales: {
        x: {
          // 'x' for Chart.js 3.x; use 'xAxes' for Chart.js 2.x
          title: {
            display: true,
            text: "Devices",
          },
          barPercentage: 1, // Bars fill the full width of the category
          categoryPercentage: 100,
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "dataType",
          },
          // Additional y-axis configuration
        },
      }
      plugins: {
        legend: {
          display: true, // Hide the legend if you only want labels under bars
          position: "top",
        },
      },
      // Include more options as necessary
    };*/

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
      setDownloadFlag(false);
      setDownloadMsg("Please select device(s) to download");
      return;
    }

    const url = `${DOWNLOAD_ENDPOINT}`;
    for (let i = 0; i < selectedDevices.length; i++) {
      try {
        const deviceId = selectedDevices[i];
        const date = formatDate(startDate);
        const response = await axios.get(url, {
          params: {
            deviceId,
            dataType,
            date,
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
        setDownloadFlag(true);
        setDownloadMsg("Data downloaded successfully");
      } catch (error) {
        console.log(error);
        setDownloadFlag(false);
        setDownloadMsg("Error downloading data");
      }
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
              Select Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(e: React.SetStateAction<any>) => setStartDate(e)}
              selectsStart
              startDate={startDate}
              className=" p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>
      </div>
      <div className="p-5 w-full">
        <h1 className="text-2xl text-white mb-5">
          {" "}
          Data from {formatDate(startDate)}
        </h1>
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

                      {/*
                      <button
                        className="bg-none text-white border-white border-solid dark:border-transparent border-2 p-2 rounded-lg w-[60px] ml-auto"
                        onClick={() =>
                          fetchDataById(
                            device.id,
                            startDate || formatDate(new Date())
                          )
                        }
                      >
                        Fetch
                      </button>*/}
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
        {downloadFlag ? (
          <p className="text-green-500 text-2xl font-bold mb-5">
            {downloadMsg}
          </p>
        ) : (
          <p className="text-red-500 text-2xl font-bold mb-5">{downloadMsg}</p>
        )}
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
