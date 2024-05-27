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

  const [searchParams, setSearchParams] = useSearchParams({
    id: project.projectId,
    view: "device",
    device: deviceId,
    tab: "download-data",
    downloadDataType: "steps",
    downloadDetailLevel: "1min",
  });

  const downloadDataType = searchParams.get("downloadDataType") || "steps";
  const downloadDetailLevel = searchParams.get("downloadDetailLevel") || "1min";

  const getDetailLevelOptions = () => {
    const baseOptions = [
      { value: "1min", label: "1 minute" },
      { value: "5min", label: "5 minutes" },
      { value: "15min", label: "15 minutes" },
    ];
    if (downloadDataType === "heart") {
      return [{ value: "1sec", label: "1 second" }, ...baseOptions];
    }
    return baseOptions;
  };

  const detailLevelTypes = getDetailLevelOptions();

  const handleDataTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDataType = event.target.value;
    setSearchParams(
      (prev) => {
        prev.set("downloadDataType", newDataType);
        if (newDataType !== "heart" && downloadDetailLevel === "1sec") {
          prev.set("downloadDetailLevel", "1min"); // Default to 1min if not heart rate
        }
        return prev;
      },
      { replace: true }
    );
    setDownloadMsg("");
  };

  const downloadTypeOptions = [
    { value: "steps", label: "Steps" },
    { value: "heart", label: "Heart Rate" },
    { value: "calories", label: "Calories" },
    { value: "distance", label: "Distance" },
    { value: "elevation", label: "Elevation" },
    { value: "floors", label: "Floors" },
  ];

  const downloadData = async () => {
    setDownloadFlag(true); // Set the flag when download starts
    if (downloadDataType !== "heart" && downloadDetailLevel === "1sec") {
      setDownloadMsg(
        "1 second detail level is only available for heart rate data"
      );
      setDownloadFlag(false);
      return;
    }
    try {
      const startDate = formatDate(downloadStartDate);
      const endDate = formatDate(downloadEndDate);

      let filename = fileNameInput;
      if (filename === "") {
        filename = `device-${deviceId}-${startDate}-${endDate}-${downloadDataType}`;
      }

      const response = await axios.get(DOWNLOAD_DATA_ENDPOINT, {
        params: {
          deviceIds: deviceId,
          dataTypes: downloadDataType,
          startDate: startDate,
          endDate: endDate,
          detailLevel: downloadDetailLevel,
          projectId: project.projectId,
          archiveName: filename,
        },
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `device-${deviceId}-${startDate}-${endDate}-${downloadDataType}.csv`
      );
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
          .csv
        </span>
      </span>

      <div className="flex-col text-secondary">
        <div className="flex flex-row gap-5">
          <div className="flex flex-col">
            <label
              htmlFor="dataType"
              className="block text-sm font-medium text-primary"
            >
              Select Data Type:
            </label>
            <select
              id="dataType"
              name="dataType"
              value={downloadDataType}
              onChange={handleDataTypeChange}
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
              className="block text-sm font-medium w-full text-primary"
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
              className="block text-sm font-medium text-primary"
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
              className="block text-sm font-medium text-primary"
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
          <p className="text-green-500 text-xl font-bold mb-3">{downloadMsg}</p>
        ) : (
          <p className="text-red-500 text-xl font-bold mb-3">{downloadMsg}</p>
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
