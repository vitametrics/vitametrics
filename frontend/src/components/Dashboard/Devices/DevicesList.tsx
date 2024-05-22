import { Fragment } from "react";
import { DeviceListProps } from "../../../types/Device";
import FullBatteryLevel from "../../../assets/FullBatteryLevel";
import MediumBatteryLevel from "../../../assets/MediumBatteryLevel";
import LowBatteryLevel from "../../../assets/LowBatteryLevel";

const DevicesList: React.FC<DeviceListProps> = ({ devices }) => {
  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-5 w-full text-primary items-center font-bold"
      >
        <button className="p-2">NAME</button>
        <button className="p-2">ID</button>
        <button className="p-2">VERSION</button>
        <button> LAST SYNC DATE</button>
        <button> BATTERY LEVEL</button>
      </div>
      {devices.map((device) => (
        <Fragment>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div
            key={device.deviceId}
            className="grid grid-cols-5 w-full items-center text-center p-2"
          >
            <span className="text-primary ml-2">{device.deviceName}</span>
            <span className="text-primary ml-2">{device.deviceId}</span>
            <span className="text-primary ml-2">{device.deviceVersion}</span>
            <span className="text-primary ml-2">{device.lastSyncTime}</span>
            <span className="text-primary text-center flex flex-row items-center justify-center gap-2">
              {device.batteryLevel >= 70 ? (
                <FullBatteryLevel />
              ) : device.batteryLevel >= 30 ? (
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
