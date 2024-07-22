import { Device } from "../../../types/Device";
import { useState, Fragment } from "react";
import axios from "axios";
import useDebounce from "../../../helpers/useDebounce";
import EditIcon from "../../../assets/EditIcon";
import CancelIcon from "../../../assets/CancelIcon";
import ConfirmIcon from "../../../assets/ConfirmIcon";
import { useProject } from "../../../helpers/ProjectContext";
import FullBatteryLevel from "../../../assets/FullBatteryLevel";
import MediumBatteryLevel from "../../../assets/MediumBatteryLevel";
import LowBatteryLevel from "../../../assets/LowBatteryLevel";

interface DeviceDetailsProps {
  device: Device;
}

const CHANGE_DEVICE_NAME_ENDPOINT = `${process.env.API_URL}/project/change-device-name`;

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deviceNameInput, setDeviceNameInput] = useState(device.deviceName);
  const debouncedDeviceName = useDebounce(deviceNameInput, 100);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const { projectId, updateProject, fetchDeviceDetails, project } =
    useProject();
  const deviceId = device.deviceId;

  const handleDeviceNameChange = async () => {
    try {
      const response = await axios.post(
        CHANGE_DEVICE_NAME_ENDPOINT,
        {
          deviceId: deviceId,
          deviceName: debouncedDeviceName,
          projectId: projectId,
        },
        { withCredentials: true }
      );
      setIsEditing(false);
      const updatedDevice = response.data.device;
      setError(false);
      setMsg(response.data.message);
      updateProject({
        devices: project.devices.map((device) =>
          device.deviceId === updatedDevice.deviceId ? updatedDevice : device
        ),
      });
      fetchDeviceDetails(deviceId);
    } catch (error) {
      setIsEditing(false);
      setError(true);
      setMsg("An error occurred while updating device name");
      console.error(error);
    }
  };

  /*
  const handleDeviceDeletion = async () => {
    try {
      await axios.post(CHANGE_DEVICE_NAME_ENDPOINT, {
        data: { deviceId },
      });
      fetchDeviceDetails(deviceId);
    } catch (error) {
      console.error(error);
    }
  };*/

  if (!device) {
    return <div>Error: Device not found</div>;
  }

  return (
    <Fragment>
      <h2 className="w-full text-2xl font-bold pb-0 text-primary my-3">
        Viewing {device.deviceName || "Device"}
      </h2>
      {msg && (
        <p className={`text-sm ${error ? "text-red-500" : "text-green-500"}`}>
          {msg}
        </p>
      )}
      <p className="flex flex-row items-center">
        <span className="font-bold mr-2">Device Name: </span>
        {isEditing ? (
          <Fragment>
            <input
              type="text"
              value={deviceNameInput}
              onChange={(e) => setDeviceNameInput(e.target.value)}
              className="border-solid border-black border-2 rounded-lg px-2"
            />
            <span
              onClick={() => handleDeviceNameChange()}
              className="hover:cursor-pointer"
            >
              <ConfirmIcon />
            </span>
            <span
              onClick={() => setIsEditing(false)}
              className="hover:cursor-pointer"
            >
              <CancelIcon />
            </span>
          </Fragment>
        ) : (
          <Fragment>
            {device.deviceName}
            <span onClick={() => setIsEditing(true)}>
              <EditIcon />
            </span>
          </Fragment>
        )}
      </p>
      <p>
        <span className="font-bold">Device ID: </span>
        {device.deviceId}
      </p>
      <p>
        <span className="font-bold">Device Type: </span>
        {device.deviceVersion}
      </p>
      <p>
        <span className="font-bold">Last Sync Time: </span>
        {device.lastSyncTime}
      </p>
      <p className="flex gap-1">
        <span className="font-bold">Battery Level: </span>
        {parseInt(device.batteryLevel) > 70 ? (
          <FullBatteryLevel />
        ) : parseInt(device.batteryLevel) > 30 ? (
          <MediumBatteryLevel />
        ) : (
          <LowBatteryLevel />
        )}
        {device.batteryLevel}%
      </p>
    </Fragment>
  );
};
export default DeviceDetails;
