/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "react-datepicker";
import { Fragment, useState } from "react";
import { useProject } from "../../../helpers/ProjectContext";
import { Device } from "../../../types/Device";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const DOWNLOAD_DATA_ENDPOINT = `${process.env.API_URL}/project/download-data`;

const DataOverview = () => {
  const {
    project,
    selectedDevices,
    handleDeviceSelectionChange,
    downloadDate,
    setDownloadDate,
  } = useProject();

  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadFlag, setDownloadFlag] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams({
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

  return (
    <Fragment>
      <div className="w-full h-[400px bg-white shadow-lg rounded-xl flex flex-col mb-10 p-10">
        <h2 className="text-left w-full text-3xl font-bold text-primary mb-3">
          Toggle Devices
        </h2>
        {/*
        <button
          className="mr-auto p-2 bg-secondary text-white font-bold rounded-xl hover:bg-hoverSecondary shadow-lg mb-5 w-[100px]"
          onClick={() => fetchDevices()}
        >
          Fetch Data
  </button>*/}
        <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>
        <div className="flex flex-col justify-between h-full w-full">
          {project.devices && project.devices.length > 0 ? (
            <Fragment>
              {project.devices && project.devices.length > 0 ? (
                <Fragment>
                  <div className="grid grid-cols-4 font-bold text-secondary2 mb-3">
                    <span>ACTION</span>
                    <span>DEVICE</span>
                    <span>NAME</span>
                    <span>ID</span>
                  </div>
                  {project.devices.map((device: Device, index: number) => (
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
            <label htmlFor="downloadDate" className="block text-sm font-medium">
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
          <p className="text-red-500 text-2xl font-bold mb-5">{downloadMsg}</p>
        )}
        <button
          className="p-5 text-2xl rounded-xl w-[250px] bg-primary text-white font-bold"
          onClick={() => downloadData()}
        >
          Download Data
        </button>
      </div>
    </Fragment>
  );
};
export default DataOverview;
