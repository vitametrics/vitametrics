/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { useProject } from "../../../helpers/ProjectContext";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../../../helpers/formatDate";

interface DeviceDownloadPanelProps {
  deviceId: string;
}
const DOWNLOAD_DATA_ENDPOINT = `${process.env.API_URL}/project/download-data`;

const DeviceDownloadPanel: React.FC<DeviceDownloadPanelProps> = ({
  deviceId,
}) => {
  const {
    project,
    downloadStartDate,
    setDownloadStartDate,
    downloadEndDate,
    setDownloadEndDate,
  } = useProject();

  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadFlag, setDownloadFlag] = useState(false);
  const [fileNameInput, setFileNameInput] = useState("");
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams({
    id: project.projectId,
    view: "device",
    device: deviceId,
    tab: "download-data",
    downloadDetailLevel: "1min",
  });

  const downloadDetailLevel = searchParams.get("downloadDetailLevel") || "1min";

  const getDetailLevelOptions = () => {
    const baseOptions = [
      { value: "1min", label: "1 minute" },
      { value: "5min", label: "5 minutes" },
      { value: "15min", label: "15 minutes" },
    ];
    if (selectedDataTypes.length === 1 && selectedDataTypes[0] === "heart") {
      return [{ value: "1sec", label: "1 second" }, ...baseOptions];
    }
    return baseOptions;
  };

  const detailLevelTypes = getDetailLevelOptions();

  const downloadTypeOptions = [
    { value: "steps", label: "Steps" },
    { value: "heart", label: "Heart Rate" },
    { value: "calories", label: "Calories" },
    { value: "distance", label: "Distance" },
    { value: "elevation", label: "Elevation" },
    { value: "floors", label: "Floors" },
  ];

  const toggleDataType = (value: string) => {
    const newDataTypes = new Set(selectedDataTypes);
    if (newDataTypes.has(value)) {
      newDataTypes.delete(value);
    } else {
      newDataTypes.add(value);
    }
    setSelectedDataTypes(Array.from(newDataTypes));
    console.log(selectedDataTypes);
    setDownloadMsg("");
  };

  const downloadData = async () => {
    setDownloadFlag(true); // Set the flag when download starts
    if (selectedDataTypes[0] !== "heart" && downloadDetailLevel === "1sec") {
      setDownloadMsg(
        "1 second detail level is only available for heart rate data"
      );
      setDownloadFlag(false);
      return;
    }
    try {
      const startDate = formatDate(downloadStartDate);
      const endDate = formatDate(downloadEndDate);

      const response = await axios.get(DOWNLOAD_DATA_ENDPOINT, {
        params: {
          deviceIds: deviceId,
          dataTypes: selectedDataTypes.join(","),
          startDate: startDate,
          endDate: endDate,
          detailLevel: downloadDetailLevel,
          projectId: project.projectId,
          archiveName: fileNameInput,
        },
        withCredentials: true,
      });

      let fileName = fileNameInput;

      if (fileName === "") {
        if (selectedDataTypes.length > 1) {
          fileName = "achive.zip";
        } else {
          fileName = `${project.projectId}-${startDate}-${endDate}-${deviceId}.csv`;
        }

        if (startDate === endDate) {
          fileName = `${project.projectId}-${startDate}-${deviceId}.csv`;
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      setDownloadMsg("Data failed to download");
      setDownloadFlag(false);
      console.error(error);
    }
  };

  return (
    <div className="">
      <h2 className="w-full text-2xl font-bold pb-0 text-primary my-3">
        Create Export
      </h2>
      <p className="text-primary mb-5">
        Individually export a device's data for a specific date
      </p>
      <span className="text-primary text-lg font-medium">Enter File Name:</span>
      <span className="flex flex-row mb-5 items-center">
        <input
          className="p-2 border border-gray-300 rounded-tl-lg rounded-bl-lg w-[500px]"
          placeholder="Enter File Name"
          value={fileNameInput}
          onChange={(e) => setFileNameInput(e.target.value)}
        />
        <span
          className=" bg-white text-primary rounded-tr-lg rounded-br-lg p-2 border-gray-300 border"
          onClick={() => setFileNameInput("")}
        >
          {selectedDataTypes.length > 1 ? ".zip" : ".csv"}
        </span>
      </span>

      <div className="flex-col text-secondary">
        <div className="flex flex-row gap-5">
          <div className="flex flex-col">
            <label className="text-primary text-lg font-medium">
              Select Data Type:
            </label>
            {downloadTypeOptions.map((option) => (
              <label
                key={option.value}
                className="inline-flex items-center ml-4"
              >
                <input
                  type="checkbox"
                  checked={selectedDataTypes.includes(option.value)}
                  onChange={() => toggleDataType(option.value)}
                />
                <span className="ml-2">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col mb-5">
            <label
              htmlFor="detailLevelType"
              className="block font-medium w-full text-primary text-lg"
            >
              Select Detail Level:
            </label>
            <select
              id="detailLevelType"
              name="detailLevelType"
              value={downloadDetailLevel}
              onChange={(e) => {
                setSearchParams(
                  (prev) => {
                    prev.set("downloadDetailLevel", e.target.value);
                    return prev;
                  },
                  { replace: true }
                ),
                  setDownloadMsg("");
              }}
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
              className="block text-lg font-medium text-primary "
            >
              Select Start Date:
            </label>
            <DatePicker
              selected={downloadStartDate}
              onChange={(e: React.SetStateAction<any>) => {
                setDownloadStartDate(e), setDownloadMsg("");
              }}
              selectsStart
              startDate={downloadStartDate}
              className=" p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="downloadDate"
              className="block text-lg font-medium text-primary"
            >
              Select End Date:
            </label>
            <DatePicker
              selected={downloadEndDate}
              onChange={(e: React.SetStateAction<any>) => {
                setDownloadEndDate(e), setDownloadMsg("");
              }}
              selectsEnd
              endDate={downloadStartDate}
              className=" p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>
        {downloadFlag ? (
          <p className="text-green-500 text-xl font-bold my-3">{downloadMsg}</p>
        ) : (
          <p className="text-red-500 text-xl font-bold my-3">{downloadMsg}</p>
        )}
        <button
          className="p-3 text-2xl rounded-xl w-[250px] bg-primary text-white font-bold hover:bg-primary2"
          onClick={() => downloadData()}
        >
          Download Data
        </button>
      </div>
    </div>
  );
};

export default DeviceDownloadPanel;
