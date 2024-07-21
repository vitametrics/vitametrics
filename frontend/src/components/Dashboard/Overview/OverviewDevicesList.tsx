import { Fragment } from "react";
import { OverviewMembersListProps } from "../../../types/Device";

const OverviewDevicesList: React.FC<OverviewMembersListProps> = ({
  devices,
}) => {
  console.log(devices);
  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-3 w-full text-primary items-center font-bold"
      >
        <button className="p-2 mr-auto">NAME</button>
        <button className="p-2 mr-auto">VERSION</button>
        <button className="p-2 mr-auto">ID</button>
      </div>
      {devices.map((device) => (
        <Fragment>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div
            key={device.deviceId}
            className="grid grid-cols-3 w-full items-center text-center p-2"
          >
            <span className="text-primary mr-auto">{device.deviceName}</span>
            <span className="text-primary mr-auto">{device.deviceVersion}</span>
            <span className="text-primary mr-auto">{device.deviceId}</span>
          </div>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default OverviewDevicesList;
