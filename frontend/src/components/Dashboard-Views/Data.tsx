/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, lazy, Suspense, useEffect } from "react";
import axios from "axios";
import { useOrg } from "../../helpers/OrgContext";
import { useSearchParams } from "react-router-dom";

const LazyBarChart = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Bar }))
);

const LazyLineChart = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Line }))
);
import "chart.js/auto";
import { useDashboard } from "../../helpers/DashboardContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
interface DataItem {
  dateTime: string;
  value: string;
}

const Data = () => {
  const { deviceViewDevices, orgName } = useOrg();
  const [searchParams, setSearchParams] = useSearchParams({
    detailLevel: "1min",
    dataType: "steps",
    graphType: "bar",
    rangeGraphType: "bar",
    rangeDataType: "stepsData",
    downloadDataType: "steps",
    downloadDetailLevel: "1min",
  });
  const rangeDataType = searchParams.get("rangeDataType") || "stepsData";
  const rangeGraphType = searchParams.get("rangeGraphType") || "bar";
  const downloadDataType = searchParams.get("downloadDataType") || "steps";
  const downloadDetailLevel = searchParams.get("downloadDetailLevel") || "1min";

  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadFlag, setDownloadFlag] = useState(false);

  const {
    setRangeStartDate,
    setRangeEndDate,
    rangeEndDate,
    rangeStartDate,
    selectedDevices,
    handleDeviceSelectionChange,
    devicesData,
    downloadDate,
    setDownloadDate,
    fetchDevices,
  } = useDashboard();
  const [rangeChartData, setRangeChartData] = useState({});

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

  const downloadTypeOptions = [
    { value: "steps", label: "Steps" },
    { value: "heart", label: "Heart Rate" },
    { value: "calories", label: "Calories" },
    { value: "distance", label: "Distance" },
    { value: "elevation", label: "Elevation" },
    { value: "floors", label: "Floors" },
  ];

  const dataTypeOptions = [
    { value: "stepsData", label: "Steps" },
    { value: "heartData", label: "Heart Rate" },
    { value: "caloriesData", label: "Calories" },
    { value: "distanceData", label: "Distance" },
    { value: "elevationData", label: "Elevation" },
    { value: "floorsData", label: "Floors" },
  ];

  const graphTypeOptions = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
  ];

  const generateLabelsForRange = (start: Date, end: Date) => {
    let currentDate = new Date(start);
    const labels = [];
    while (currentDate <= end) {
      labels.push(formatDate(currentDate));
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return labels;
  };

  const createRangeDataset = () => {
    const start = new Date(rangeStartDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(rangeEndDate);
    end.setHours(23, 59, 59, 999);

    const labels = generateLabelsForRange(start, end);

    const datasets = selectedDevices
      .map((deviceId) => {
        let device = undefined as DeviceData | undefined;
        for (const deviceData of devicesData) {
          if (deviceData[0].deviceId === deviceId) {
            device = deviceData[0];
            break;
          }
        }

        if (!device) {
          return null;
        }

        const label =
          device["deviceInfo"].deviceVersion + " " + device.deviceId;
        const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        const dataByDate = new Map(
          device["stepsData"].map((item: DataItem) => [
            item.dateTime,
            item.value,
          ])
        );

        const data = labels.map((dateLabel) => dataByDate.get(dateLabel) || 0);

        return {
          label,
          data,
          borderColor,
          backgroundColor,
          tension: 0.1,
          fill: false,
        };
      })
      .filter((dataset) => dataset !== null);

    setRangeChartData({
      labels,
      datasets,
    });
  };

  const renderRangeGraph = () => {
    const options = {
      maintainAspectRatio: false,
      response: true,
    };

    switch (rangeGraphType) {
      case "bar":
        return (
          <Suspense fallback={<div>Loading Chart...</div>}>
            <LazyBarChart
              data={{ datasets: [], ...rangeChartData }}
              options={options}
            />
          </Suspense>
        );
      case "line":
        return (
          <Suspense fallback={<div>Loading Chart...</div>}>
            <LazyLineChart
              data={{ datasets: [], ...rangeChartData }}
              options={options}
            />
          </Suspense>
        );

      default:
        return (
          <Suspense fallback={<div>Loading Chart...</div>}>
            <LazyBarChart
              data={{ datasets: [], ...rangeChartData }}
              options={options}
            />
          </Suspense>
        );
    }
  };

  const downloadData = async () => {
    if (selectedDevices.length === 0) {
      setDownloadFlag(false);
      setDownloadMsg("Please select device(s) to download");
      return;
    }

    for (const deviceId of selectedDevices) {
      try {
        const date = formatDate(downloadDate);
        const response = await axios.get(
          "https://vitametrics.org/api/org/download-data",
          {
            params: {
              deviceId: deviceId,
              dataType: downloadDataType,
              date: date,
              detailLevel: downloadDetailLevel,
            },
            withCredentials: true,
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `device-${deviceId}-${date}-${downloadDataType}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } catch (error) {
        setDownloadFlag(false);
        setDownloadMsg("Data failed to download");
        return;
      }
    }

    setDownloadFlag(true);
    setDownloadMsg("Data downloaded successfully");
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

  useEffect(() => {
    createRangeDataset();
  }, [
    selectedDevices,
    rangeDataType,
    rangeStartDate,
    rangeEndDate,
    devicesData,
  ]);

  const fadeInItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-[#1E1D20] dark:bg-hero-texture"
    >
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0 mb-5">
        {orgName} Overview
      </h2>
      <span className="p-5">
        <button
          className="mr-auto p-3 bg-white rounded-xl hover:bg-slate-200"
          onClick={() => fetchDevices()}
        >
          Fetch Data{" "}
        </button>
      </span>
      <div className="p-5 w-full flex-col">
        <h1 className="text-2xl text-yellow-500 mb-2">
          {" "}
          Data from {formatDate(rangeStartDate)} to {formatDate(rangeEndDate)}
        </h1>

        <div className="flex flex-row w-full gap-5 mb-5">
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
                value={rangeDataType}
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("rangeDataType", e.target.value);
                      return prev;
                    },
                    { replace: true }
                  )
                }
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
                value={rangeGraphType}
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("rangeGraphType", e.target.value);
                      return prev;
                    },
                    { replace: true }
                  )
                }
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

          <div className="flex flex-row w-full gap-5 items-center">
            <div className="ml-auto">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium  text-white"
              >
                Select Start Date:
              </label>
              <DatePicker
                selected={rangeStartDate}
                onChange={(e: React.SetStateAction<any>) =>
                  setRangeStartDate(e)
                }
                selectsStart
                startDate={rangeStartDate}
                className=" p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium  text-white"
              >
                Select End Date:
              </label>
              <DatePicker
                selected={rangeEndDate}
                onChange={(e: React.SetStateAction<any>) => setRangeEndDate(e)}
                selectsEnd
                startDate={rangeEndDate}
                endDate={rangeEndDate}
                minDate={rangeStartDate}
                className=" p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[500px] p-5 text-white bg-[#2F2D2D] rounded-xl flex justify-center items-center mb-10">
          {renderRangeGraph()}
        </div>
        <div className="w-full h-[400px] text-white bg-[#2F2D2D] rounded-xl flex flex-col mb-10">
          <h2 className="text-center w-full text-white p-5 text-4xl">
            Devices
          </h2>
          <div className="flex flex-row justify-between h-full w-full p-5 gap-5">
            {deviceViewDevices && deviceViewDevices.length > 0 ? (
              deviceViewDevices.map(
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

        <div className="flex-col">
          <div className="flex flex-row gap-5">
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
                value={downloadDataType}
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("downloadDataType", e.target.value);
                      return prev;
                    },
                    { replace: true }
                  )
                }
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="defaultDataType" disabled>
                  -- Select Data Type --
                </option>
                {downloadTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col mb-5">
              <label
                htmlFor="detailLevelType"
                className="block text-sm font-medium w-full text-white"
              >
                Select Detail Level:
              </label>
              <select
                id="detailLevelType"
                name="detailLevelType"
                value={downloadDetailLevel}
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("downloadDetailLevel", e.target.value);
                      return prev;
                    },
                    { replace: true }
                  )
                }
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
            <div className="flex flex-col">
              <label
                htmlFor="downloadDate"
                className="block text-sm font-medium  text-white"
              >
                Select Start Date:
              </label>
              <DatePicker
                selected={downloadDate}
                onChange={(e: React.SetStateAction<any>) => setDownloadDate(e)}
                selectsStart
                startDate={downloadDate}
                className=" p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
          {downloadFlag ? (
            <p className="text-green-500 text-2xl font-bold mb-5">
              {downloadMsg}
            </p>
          ) : (
            <p className="text-red-500 text-2xl font-bold mb-5">
              {downloadMsg}
            </p>
          )}
          <button
            className="p-5 text-2xl rounded-xl w-[250px] bg-[#606060] text-white"
            onClick={() => downloadData()}
          >
            Download Data
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Data;
