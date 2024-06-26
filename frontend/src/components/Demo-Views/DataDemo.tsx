/* eslint-disable @typescript-eslint/no-explicit-any */
//import DatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { Line, Bar, Pie, Scatter, Doughnut } from "react-chartjs-2";
import { useSearchParams } from "react-router-dom";
import "chart.js/auto"; // Importing auto registration of chart.js
import { useDemo } from "../../helpers/DemoContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type DataItem = {
  date: string;
  value: number;
};

type DeviceData = {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  ownerName: string;
  heart: DataItem[];
  steps: DataItem[];
  calories: DataItem[];
  distance: DataItem[];
  elevation: DataItem[];
  floors: DataItem[];
  [key: string]: any; // This line is the index signature
};

const DataDemo = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    detailLevel: "1min",
    dataType: "heart",
    graphType: "bar",
    rangeGraphType: "bar",
    rangeDataType: "heart",
    rangeDetailLevel: "1min",
  });

  const dataType = searchParams.get("dataType") || "heart";
  const graphType = searchParams.get("graphType") || "bar";
  const detailLevel = searchParams.get("detailLevel") || "1min";
  const rangeDataType = searchParams.get("rangeDataType") || "heart";
  const rangeGraphType = searchParams.get("rangeGraphType") || "bar";
  const rangeDetailLevel = searchParams.get("rangeDetailLevel") || "1min";
  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadFlag, setDownloadFlag] = useState(false);

  const {
    startDate,
    setStartDate,
    setRangeStartDate,
    setRangeEndDate,
    rangeEndDate,
    rangeStartDate,
    devices,
  } = useDemo();

  const orgName = "Ada Lovelace's Org";

  const [chartData, setChartData] = useState({});
  const [rangeChartData, setRangeChartData] = useState({});
  const [selectedDevices, setSelectedDevices] = useState<string[]>(
    devices.map((device) => device.id)
  );

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

  const createDataset = () => {
    const formattedDate = formatDate(startDate);

    const labels = selectedDevices.map((deviceId) => {
      const device = devices.find((d) => d.id === deviceId);
      return device ? device.deviceVersion + " " + device.id : "Unknown";
    });

    const dataPoints = selectedDevices.map((deviceId) => {
      const device = devices.find((d) => d.id === deviceId);
      if (!device) return { x: "Unknown", y: 0 };

      const dataPoint = device[dataType]?.find(
        (item: DeviceData) => item.date === formattedDate
      );

      return {
        x: device.deviceVersion + " " + device.id,
        y: dataPoint ? dataPoint.value : 0,
        device: deviceId,
      };
    });

    const datasets = [
      {
        data: dataPoints,
        backgroundColor: labels.map(
          () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        ),
      },
    ];

    setChartData({
      labels,
      datasets,
    });
  };

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
        const device = devices.find((d) => d.id === deviceId);
        if (!device) return null;

        const label = device.deviceVersion + device.id;
        const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const dataByDate = new Map(
          device[rangeDataType].map((item: DataItem) => [item.date, item.value])
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
      .filter((dataset) => dataset !== null); // Filter out null datasets

    setRangeChartData({
      labels, // Use dates from the first device as labels
      datasets,
    });
  };

  const handleDeviceSelectionChange = (
    deviceId: string,
    isChecked: boolean
  ) => {
    setSelectedDevices((prev) =>
      isChecked ? [...prev, deviceId] : prev.filter((id) => id !== deviceId)
    );
  };

  const renderRangeGraph = () => {
    const options = {
      maintainAspectRatio: false,
      response: true,
    };

    switch (rangeGraphType) {
      case "bar":
        return (
          <Bar data={{ datasets: [], ...rangeChartData }} options={options} />
        );
      case "line":
        return (
          <Line data={{ datasets: [], ...rangeChartData }} options={options} />
        );
      case "pie":
        return (
          <Pie
            data={{ datasets: [], ...rangeChartData }}
            options={{ responsive: true }}
          />
        );
      case "doughnut":
        return (
          <Doughnut
            data={{ datasets: [], ...rangeChartData }}
            options={{ responsive: true }}
          />
        );
      case "scatter":
        return (
          <Scatter
            data={{ datasets: [], ...rangeChartData }}
            options={{ responsive: true }}
          />
        );

      default:
        return (
          <Bar
            data={{ datasets: [], ...rangeChartData }}
            options={{ responsive: true }}
          />
        );
    }
  };

  const renderGraph = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          offset: true,
          ticks: {
            autoSkip: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Value",
          },
        },
      },
      plugins: {
        legend: {
          display: true, // Show the legend
          position: "bottom",
          onClick: (_evt: any, legendItem: any, legend: any) => {
            const index = legend.chart.data.labels.indexOf(legendItem.text);
            console.log(index);
            if (index > -1) {
              const meta = legend.chart.getDatasetMeta(0);
              const item = meta.data[index];
              legend.chart.toggleDataVisibility(index);
              item.hidden = !item.hidden;
            }
            legend.chart.update();
          },
          labels: {
            generateLabels: (chart: any) => {
              const datasets = chart.data.datasets;
              return chart.data.labels.map((label: string, i: number) => ({
                text: label,
                fontColor: "white",
                fillStyle: datasets[0].backgroundColor[i],
                datasetIndex: i,
                hidden: chart.getDatasetMeta(0).data[i].hidden,
              }));
            },
          },
        },
      },
    };

    switch (graphType) {
      case "bar":
        return (
          <Bar
            data={{ datasets: [], ...chartData }}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins.legend,
                  position: "bottom",
                },
              },
            }}
            width="100%"
          />
        );
      case "line":
        return (
          <Line
            data={{ datasets: [], ...chartData }}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins.legend,
                  position: "bottom",
                },
              },
            }}
            width="100%"
          />
        );
      case "scatter":
        return (
          <Scatter
            data={{ datasets: [], ...chartData }}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins.legend,
                  position: "bottom", // Replace "bottom" with the desired position
                },
              },
            }}
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
    /*
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
    */
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
    createDataset();
  }, [selectedDevices, dataType, startDate]);

  useEffect(() => {
    createRangeDataset();
  }, [selectedDevices, rangeDataType, rangeStartDate, rangeEndDate]);

  const fadeInItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const { ref, inView } = useInView({
    threshold: 0.1, // Adjust based on when you want the animation to trigger (1 = fully visible)
    triggerOnce: true, // Ensures the animation only plays once
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

      <div className="p-5 w-full flex-col">
        <h1 className="text-2xl text-yellow-500 mb-2">
          {" "}
          Data from {formatDate(startDate)}
        </h1>
        <div className="flex flex-row w-full gap-5 mb-5">
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
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("dataType", e.target.value);
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
                value={graphType}
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("graphType", e.target.value);
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
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("detailLevel", e.target.value);
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
        <div className="w-full h-[500px] p-5 text-white bg-[#2F2D2D] rounded-xl flex justify-center items-center mb-10">
          {renderGraph()}
        </div>

        <h1 className="text-2xl text-yellow-500 mb-2">
          {" "}
          Data from {formatDate(rangeStartDate)} to {formatDate(rangeEndDate)}
        </h1>

        <div className="flex flex-row w-full gap-5 mb-5">
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
                value={rangeDetailLevel}
                onChange={(e) =>
                  setSearchParams(
                    (prev) => {
                      prev.set("rangeDetailLevel", e.target.value);
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
            {devices.length > 0 ? (
              devices.map(
                (
                  device: {
                    id: string;
                    deviceVersion: string;
                    lastSyncTime: string;
                    batteryLevel: number;
                    ownerName: string;
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
                          {device.ownerName}
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
          Download Data
        </button>
      </div>
    </motion.div>
  );
};

export default DataDemo;
