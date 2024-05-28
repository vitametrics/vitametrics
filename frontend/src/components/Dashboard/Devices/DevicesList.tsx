/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment } from "react";
import { DeviceListProps } from "../../../types/Device";
import FullBatteryLevel from "../../../assets/FullBatteryLevel";
import MediumBatteryLevel from "../../../assets/MediumBatteryLevel";
import LowBatteryLevel from "../../../assets/LowBatteryLevel";

const DevicesList: React.FC<DeviceListProps> = ({ devices, onDeviceClick }) => {
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
        <button className="p-2">OWNER</button>
        <button className="p-2">VERSION</button>
        <button>LAST SYNC DATE</button>
        <button>BATTERY LEVEL</button>
      </div>
      {devices.map((device) => (
        <Fragment key={device.deviceId}>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div
            className="grid grid-cols-5 w-full items-center text-center py-2 hover:cursor-pointer hover:bg-slate-50"
            onClick={() => onDeviceClick(device.deviceId)}
          >
            <span className="text-primary">
              {truncateName(device.deviceName)}
            </span>

            <span className="text-primary">{device.ownerName}</span>
            <span className="text-primary">{device.deviceVersion}</span>
            <span className="text-primary">{device.lastSyncTime}</span>
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
