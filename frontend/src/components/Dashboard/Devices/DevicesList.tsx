/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, useCallback, useState } from "react";
import { DeviceListProps } from "../../../types/Device";
import FullBatteryLevel from "../../../assets/FullBatteryLevel";
import MediumBatteryLevel from "../../../assets/MediumBatteryLevel";
import LowBatteryLevel from "../../../assets/LowBatteryLevel";
import axios from "axios";
import { useProject } from "../../../helpers/ProjectContext";
import EditIcon from "../../../assets/EditIcon";
import ConfirmIcon from "../../../assets/ConfirmIcon";
import CancelIcon from "../../../assets/CancelIcon";

const CHANGE_DEVICE_NAME_ENDPOINT = `${process.env.API_URL}/project/change-device-name`;

const DevicesList: React.FC<DeviceListProps> = ({ devices }) => {
  const { fetchProjectDevices, setProjectDevices, projectDevices, projectId } =
    useProject();

  const [editingDevices, setEditingDevices] = useState<Record<string, string>>(
    {}
  );

  const handleOwnerNameChange = useCallback(
    async (deviceId: string) => {
      const deviceName = editingDevices[deviceId];
      try {
        await axios.post(
          CHANGE_DEVICE_NAME_ENDPOINT,
          { deviceId: deviceId, deviceName: deviceName, projectId: projectId },
          { withCredentials: true }
        );
        const updatedDevices = projectDevices.map((device) => {
          if (device.deviceId === deviceId) {
            return { ...device, deviceName: deviceName };
          }
          return device;
        });
        setProjectDevices(updatedDevices);
        handleCancelEdit(deviceId);
      } catch (error) {
        const updatedDevices = projectDevices.map((device) => {
          if (device.deviceId === deviceId) {
            return { ...device, deviceName: deviceName };
          }
          return device;
        });
        setProjectDevices(updatedDevices);
        handleCancelEdit(deviceId);

        console.error("Error changing device name:", error);
      }
    },
    [editingDevices, fetchProjectDevices]
  );

  const handleEditChange = (deviceId: string, newName: string) => {
    setEditingDevices((prev) => ({
      ...prev,
      [deviceId]: newName,
    }));
  };

  const handleCancelEdit = (deviceId: string) => {
    setEditingDevices((prev) => {
      const { [deviceId]: _, ...rest } = prev;
      return rest;
    });
  };
  const truncateName = (name: string) => {
    return name.length > 25 ? `${name.substring(0, 22)}...` : name;
  };

  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-5 w-full text-primary items-center font-bold"
      >
        <button className="p-2">NAME</button>
        <button className="p-2">ID</button>
        <button className="p-2">VERSION</button>
        <button>LAST SYNC DATE</button>
        <button>BATTERY LEVEL</button>
      </div>
      {devices.map((device) => (
        <Fragment key={device.deviceId}>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div className="grid grid-cols-5 w-full items-center text-center p-2">
            {editingDevices[device.deviceId] !== undefined ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editingDevices[device.deviceId]}
                  onChange={(e) =>
                    handleEditChange(device.deviceId, e.target.value)
                  }
                  className="text-primary ml-2 bg-slate-300 px-2 rounded-lg"
                />
                <button onClick={() => handleOwnerNameChange(device.deviceId)}>
                  <ConfirmIcon />
                </button>
                <button onClick={() => handleCancelEdit(device.deviceId)}>
                  <CancelIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={() =>
                    handleEditChange(device.deviceId, device.deviceName)
                  }
                >
                  <EditIcon />
                </button>
                <span className="text-primary ml-2">
                  {truncateName(device.deviceName)}
                </span>
              </div>
            )}
            <span className="text-primary ml-2">{device.deviceId}</span>
            <span className="text-primary ml-2">{device.deviceVersion}</span>
            <span className="text-primary ml-2">{device.lastSyncTime}</span>
            <span className="text-primary text-center flex flex-row items-center justify-center gap-2">
              {parseInt(device.batteryLevel) >= 70 ? (
                <FullBatteryLevel />
              ) : parseInt(device.batteryLevel) >= 30 ? (
                <MediumBatteryLevel />
              ) : (
                <LowBatteryLevel />
              )}
              {device.batteryLevel}%
            </span>
          </div>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default DevicesList;
