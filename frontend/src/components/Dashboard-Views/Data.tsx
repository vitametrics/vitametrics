/* eslint-disable @typescript-eslint/no-explicit-any */
//import DatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";
//import { Chart } from "chart.js";
//import { Line, Bar } from "react-chartjs-2";
//import "chart.js/auto"; // Importing auto registration of chart.js

interface DataProps {
  devices: any[];
  orgName: string;
  fetchDevice: (id: string, startDate: string, endDate: string) => void;
  syncDevice: (id: string, start: Date, end: Date) => void;
}

const Data: React.FC<DataProps> = ({
  devices,
  orgName,
  fetchDevice,
  syncDevice,
}) => {
  const DOWNLOAD_ENDPOINT = import.meta.env.VITE_APP_DOWNLOAD_DATA_ENDPOINT;
  const [dataType, setDataType] = useState("All");
  //const [graphType, setGraphType] = useState("Bar");

  //YYYY - MM - DD
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  //const [chartData, setChartData] = useState({});

  /*
  useEffect(() => {
    const datasets = selectedDevices
      .map((deviceId) => {
        const device = devices.find((d) => d.device_id === deviceId);
        if (!device) return null; // Skip if device not found

        const label = device.device_id; // Use device ID as label
        const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color for each dataset
        const data = device.steps.map((step: any) => step.value);

        return { label, data, borderColor, tension: 0.1, fill: false };
      })
      .filter((dataset) => dataset !== null); // Filter out null datasets

    setChartData({
      labels: devices[0]?.steps.map((step: any) => step.date), // Use dates from the first device as labels
      datasets,
    });
  }, [devices, selectedDevices]);*/

  useEffect(() => {
    console.log(startDate);
    console.log(endDate);
  }, [startDate, endDate]);

  const handleDeviceSelectionChange = (
    deviceId: string,
    isChecked: boolean
  ) => {
    setSelectedDevices((prev) =>
      isChecked ? [...prev, deviceId] : prev.filter((id) => id !== deviceId)
    );
    setDeviceId(deviceId); //for testing
  };

  const dataTypeOptions = [
    { value: "All", label: "All" },
    { value: "heart_rate", label: "Heart Rate" },
    { value: "sleep", label: "Sleep" },
  ];

  /*
  const graphTypeOptions = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
  ];*/

  const downloadData = async () => {
    if (!deviceId) {
      console.error("Device ID is required");
      return;
    }

    const url = `${DOWNLOAD_ENDPOINT}`;

    try {
      const response = await axios.get(url, {
        params: {
          deviceId,
        },
        withCredentials: true,
        responseType: "blob", // Ensure you get the response as a Blob
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
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full h-full flex flex-col p-10 bg-[#FAF9F6] dark:bg-[#1E1D20] dark:bg-hero-texture">
      <h2 className="w-full text-4xl font-ralewayBold text-[#373F51] dark:text-white p-5 pb-0">
        {orgName} Overview
      </h2>
      <div className="flex flex-row p-5 w-full gap-5">
        {/* Data Type Dropdown */}
        <div className="mr-auto">
          <label
            htmlFor="dataType"
            className="block text-sm font-medium  text-[#373F51] dark:text-white"
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

        <div className="flex flex-row w-full gap-5">
          <div className="ml-auto">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium  text-[#373F51] dark:text-white"
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
              className="block text-sm font-medium  text-[#373F51] dark:text-white"
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
        <div className="w-full h-[500px] bg-[#99BBCD] text-white dark:bg-[#2F2D2D] rounded-xl flex justify-center items-center mb-10">
          {/*
          <Bar
            data={{ datasets: [], ...chartData }}
            options={{ responsive: true }}
            />*/}
        </div>
        <div className="w-full h-[400px] bg-[#5086A2] text-white dark:bg-[#2F2D2D] rounded-xl flex flex-col mb-10">
          <h2 className="text-center w-full text-white p-5 text-4xl">
            Devices
          </h2>
          <div className="flex flex-row justify-between h-full w-full p-5 gap-5">
            {devices.length > 0 ? (
              devices.map(
                (
                  device: {
                    device_id: string;
                    device_type: string;
                    last_sync_date: string;
                    battery_level: number;
                  },
                  index: number
                ) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row gap-5 items-center w-full h-[70px] bg-[#93C7E1] dark:bg-[#434040] p-5 rounded-xl"
                    >
                      <div className="flex flex-row mr-3 items-center justify-center">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleDeviceSelectionChange(
                              device.device_id,
                              e.target.checked
                            )
                          }
                          checked={selectedDevices.includes(device.device_id)}
                          className="w-9 h-[44px] mr-2  bg-gray-100 checked:accent-[#aae5ff] dark:accent-[#BA6767] border-gray-300 rounded-xl focus:ring-transparent dark:checked:accent-[#BA6767]"
                        />
                        <p className="text-2xl font-bold text-white mr-auto ">
                          {device.device_id}
                        </p>
                      </div>

                      <button
                        className="bg-[#93C7E1] dark:bg-[#BA6767] border-white border-solid dark:border-transparent border-2 p-2 rounded-lg w-[60px] ml-auto"
                        onClick={() =>
                          fetchDevice(
                            device.device_id,
                            startDate || formatDate(new Date()),
                            endDate || formatDate(new Date())
                          )
                        }
                      >
                        Fetch
                      </button>
                      <button
                        className="bg-[#93C7E1] dark:bg-[#BA6767] border-white dark:border-transparent border-solid border-2 p-2 rounded-lg w-[60px]"
                        onClick={() =>
                          syncDevice(
                            device.device_id,
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
          className="p-5 text-2xl rounded-xl w-[250px] bg-[#93C7E1] dark:bg-[#AE6B69] text-white"
          onClick={() => downloadData()}
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default Data;
