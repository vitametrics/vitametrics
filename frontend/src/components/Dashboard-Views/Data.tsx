/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, lazy, Suspense, useEffect, Fragment } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "chart.js/auto";
import { useProject } from "../../helpers/ProjectContext";
import { motion } from "framer-motion";
import { Device, DeviceData, DataItem } from "../../types/Device";
import useCustomInView from "../../hooks/useCustomInView";

const LazyBarChart = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Bar }))
);
const LazyLineChart = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Line }))
);

const Data = () => {
  const DOWNLOAD_DATA_ENDPOINT = `${process.env.API_URL}/project/download-data`;
  const { ref, inView } = useCustomInView();

  const {
    projectDevices,
    project,
    devicesData,
    setRangeStartDate,
    setRangeEndDate,
    rangeEndDate,
    rangeStartDate,
    selectedDevices,
    handleDeviceSelectionChange,
    downloadDate,
    setDownloadDate,
    fetchDevices,
  } = useProject();
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
        console.log(devicesData);
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
      labels, // Use dates from the first device as labels
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
        const response = await axios.get(DOWNLOAD_DATA_ENDPOINT, {
          params: {
            deviceId: deviceId,
            dataType: downloadDataType,
            date: date,
            detailLevel: downloadDetailLevel,
            projectId: project.projectId,
          },
          withCredentials: true,
        });

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

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
    >
      <h2 className="w-full text-4xl text-primary p-5 pb-0 mb-5 font-bold">
        {project.projectName} Data
      </h2>
      <span className="p-5">
        <button
          className="mr-auto p-3 bg-secondary text-white font-bold rounded-xl hover:bg-hoverSecondary shadow-lg"
          onClick={() => fetchDevices()}
        >
          Fetch Data{" "}
        </button>
      </span>
      <div className="p-5 w-full flex flex-col">
        <h1 className="text-2xl text-primary mb-2 font-bold">
          {" "}
          Data from {formatDate(rangeStartDate)} to {formatDate(rangeEndDate)}
        </h1>

        <div className="flex flex-row w-full gap-5 mb-5">
          <div className="mr-auto flex flex-row gap-5 text-secondary">
            <div className="flex flex-col">
              <label htmlFor="dataType" className="block text-sm font-medium">
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
            <div className="flex flex-col ">
              <label htmlFor="graphType" className="block text-sm font-medium">
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

          <div className="flex flex-row w-full gap-5 items-center text-secondary">
            <div className="ml-auto">
              <label htmlFor="startDate" className="block text-sm font-medium">
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
              <label htmlFor="startDate" className="block text-sm font-medium">
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
        <div className="w-full h-[500px] p- bg-white shadow-lg rounded-xl flex justify-center items-center mb-10">
          {renderRangeGraph()}
        </div>
        <div className="w-full h-[400px bg-white shadow-lg rounded-xl flex flex-col mb-10 p-10">
          <h2 className="text-left w-full text-3xl font-bold text-primary mb-3">
            Toggle Devices
          </h2>
          <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>
          <div className="flex flex-col justify-between h-full w-full">
            {devicesData && devicesData.length > 0 ? (
              <Fragment>
                {projectDevices && projectDevices.length > 0 ? (
                  <Fragment>
                    <div className="grid grid-cols-4 font-bold text-secondary2 mb-3">
                      <span>ACTION</span>
                      <span>DEVICE</span>
                      <span>NAME</span>
                      <span>ID</span>
                    </div>
                    {projectDevices.map((device: Device, index: number) => (
                      <Fragment>
                        <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>

                        <div
                          className="grid grid-cols-4 mr-3 items-center justify-center mb-2"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleDeviceSelectionChange(
                                device.deviceId,
                                e.target.checked
                              )
                            }
                            checked={selectedDevices.includes(device.deviceId)}
                            className="w-9 h-[20px] mr-2 bg-gray-100 accent-[#7d8bae] border-gray-300 rounded-xl focus:ring-transparent"
                          />
                          <span>{device.deviceVersion}</span>
                          <span>{device.deviceName}</span>
                          <span>{device.deviceId} </span>
                        </div>
                      </Fragment>
                    ))}
                  </Fragment>
                ) : (
                  <div className="flex justify-center items-center w-full h-full text-secondary">
                    No Devices Found
                  </div>
                )}
              </Fragment>
            ) : (
              <div className="text-left w-full h-full text-secondary">
                No Device Data was found
              </div>
            )}
          </div>
        </div>

        <div className="flex-col text-secondary">
          <div className="flex flex-row gap-5">
            <div className="flex flex-col">
              <label htmlFor="dataType" className="block text-sm font-medium">
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
                className="block text-sm font-medium w-ful"
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
                className="block text-sm font-medium"
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
            className="p-5 text-2xl rounded-xl w-[250px] bg-primary text-white font-bold"
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
