/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { useProject } from "../../../helpers/ProjectContext";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";

interface DeviceDownloadPanelProps {
  deviceId: string;
}
const DOWNLOAD_DATA_ENDPOINT = `${process.env.API_URL}/project/download-data`;

const DeviceDownloadPanel: React.FC<DeviceDownloadPanelProps> = ({
  deviceId,
}) => {
  const { project, downloadDate, setDownloadDate } = useProject();

  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadFlag, setDownloadFlag] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams({
    id: project.projectId,
    view: "device",
    device: deviceId,
    tab: "download-data",
    detailLevel: "1min",
    dataType: "steps",
    graphType: "bar",
    rangeGraphType: "bar",
    rangeDataType: "stepsData",
    downloadDataType: "steps",
    downloadDetailLevel: "1min",
  });

  const downloadDataType = searchParams.get("downloadDataType") || "steps";
  const downloadDetailLevel = searchParams.get("downloadDetailLevel") || "1min";

  const detailLevelTypes = [
    {
      value: "1sec",
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

  const downloadData = async () => {
    setDownloadFlag(true); // Set the flag when download starts
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
      setDownloadMsg("Data failed to download");
      setDownloadFlag(false);
      console.error(error);
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
    <div className="">
      <h2 className="w-full text-2xl font-bold pb-0 text-primary my-3">
        Create Export
      </h2>
      <p className="text-primary mb-5">
        Individually export a device's data for a specific date
      </p>
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
              className="block text-sm font-medium w-full text-primary"
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
              className="block text-sm font-medium text-primary"
            >
              Select Date:
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
