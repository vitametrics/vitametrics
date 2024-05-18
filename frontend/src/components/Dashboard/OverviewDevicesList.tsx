import { Fragment } from "react";
import { OverviewMembersListProps } from "../../types/Device";

const OverviewDevicesList: React.FC<OverviewMembersListProps> = ({
  devices,
}) => {
  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-3 w-full text-primary items-center font-bold"
      >
        <button className="p-2">NAME</button>
        <button className="p-2">VERSION</button>
        <button className="p-2">ID</button>
      </div>
      {devices.map((device) => (
        <Fragment>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div
            key={device.deviceId}
            className="grid grid-cols-3 w-full items-center text-center p-2"
          >
            <span className="text-primary ml-2">{device.deviceName}</span>
            <span className="text-primary ml-2">{device.deviceVersion}</span>
            <span className="text-primary ml-2">{device.deviceId}</span>
          </div>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default OverviewDevicesList;
