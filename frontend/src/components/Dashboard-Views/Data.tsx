/* eslint-disable @typescript-eslint/no-explicit-any */
//import DatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Device {
  device_id: string;
  device_type: string;
  last_sync_date: string;
  battery_level: number;
}

interface DataProps {
  devices: any[];
  orgName: string;
  fetchDevice: (id: string, startDate: string, endDate: string) => void;
}

const Data: React.FC<DataProps> = ({ devices, orgName, fetchDevice }) => {
  const DOWNLOAD_ENDPOINT = import.meta.env.VITE_APP_DOWNLOAD_DATA_ENDPOINT;
  const [dataType, setDataType] = useState("All");
  //YYYY - MM - DD
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  useEffect(() => {
    console.log(startDate);
    console.log(endDate);
  }, [startDate, endDate]);

  const handleDeviceSelectionChange = (
    deviceId: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      // Add the device ID to the selected devices array if not already present
      setSelectedDevices((prev) => [...prev, deviceId]);
      setDeviceId(deviceId);
      console.log(selectedDevices);
    } else {
      // Remove the device ID from the selected devices array
      setSelectedDevices((prev) => prev.filter((id) => id !== deviceId));
      console.log(selectedDevices);
    }
  };

  const dataTypeOptions = [
    { value: "All", label: "All" },
    { value: "Heart Rate", label: "Heart Rate" },
    { value: "Sleep", label: "Sleep" },
  ];

  const downloadData = async () => {
    if (!deviceId) {
      console.error("Device ID is required");
      return;
    }

    const url = `${DOWNLOAD_ENDPOINT}/${deviceId}`;

    try {
      const response = await axios.get(url, {
        withCredentials: true,
      });

      console.log(response.data);
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
      <div className="flex flex-row p-5 w-full">
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
          {" "}
          Insert Graph Here.{" "}
        </div>
        <div className="w-full h-[400px] bg-[#5086A2] text-white dark:bg-[#838383] rounded-xl flex flex-col mb-10">
          <h2 className="text-center w-full text-[#1B1B1B] p-5 text-4xl">
            Devices
          </h2>
          <div className="flex justify-center items-center h-full w-full">
            {devices.length > 0 ? (
              devices.map((device, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center  w-full h-[70px] bg-[#93C7E1] dark:bg-[#2E2E2E] p-5"
                  >
                    <input
                      type="checkbox"
                      className="mr-3"
                      onChange={(e) =>
                        handleDeviceSelectionChange(
                          device.device_id,
                          e.target.checked
                        )
                      }
                      checked={selectedDevices.includes(device.device_id)}
                    />
                    <button
                      onClick={() =>
                        fetchDevice(
                          device.device_id,
                          startDate || formatDate(new Date()),
                          endDate || formatDate(new Date())
                        )
                      }
                    >
                      {" "}
                      Fetch{" "}
                    </button>
                    <p className="text-2xl font-bold text-white mr-auto ">
                      {device.device_id}
                    </p>
                  </div>
                );
              })
            ) : (
              <> No Devices Found</>
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
