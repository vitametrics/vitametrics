/* eslint-disable @typescript-eslint/no-unused-vars */
//import FiftyPercentIcon from "../../assets/FiftyPercentIcon";
import { Fragment, useState } from "react";
import { useDemo } from "../../helpers/DemoContext";

const MAX_NAME_LENGTH = 15;

interface Device {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  ownerName: string;
}

const DevicesDemo = () => {
  const orgName = "Ada Lovelace's Org";
  const { devices, setDevices } = useDemo();

  const [editingDevices, setEditingDevices] = useState<{
    [key: string]: string;
  }>({});

  const Device = (device: Device) => {
    const isEditing = editingDevices[device.id] !== undefined;

    const handleOwnerNameChange = async () => {
      //test code -- can be used for demo
      const updatedOwnerName = editingDevices[device.id];
      const updatedDevices = devices.map((d) =>
        d.id === device.id ? { ...d, ownerName: updatedOwnerName } : d
      );
      setDevices(updatedDevices);
      setEditingDevices((prevEditingDevices) => {
        const { [device.id]: removed, ...rest } = prevEditingDevices;
        return rest;
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleOwnerNameChange();
      }
    };

    return (
      <div className="grid grid-cols-4 w-full h-[70px] bg-[#2E2E2E] rounded-xl p-5">
        <p className="text-2xl font-bold text-white mr-auto overflow-fix">
          {device.deviceVersion || ""}
        </p>
        <h2 className="text-2xl font-bold text-white align flex items-center mr-3 overflow-fix">
          ID: {device.id || ""}
        </h2>
        <div className="flex flex-row items-center gap-2">
          {isEditing ? (
            <Fragment>
              <input
                type="text"
                value={editingDevices[device.id]}
                maxLength={MAX_NAME_LENGTH}
                className="p-1 rounded-lg"
                placeholder="Enter new owner name"
                onChange={(e) =>
                  setEditingDevices((prevEditingDevices) => ({
                    ...prevEditingDevices,
                    [device.id]: e.target.value,
                  }))
                }
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleOwnerNameChange}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="15"
                  height="15"
                  viewBox="0 0 30 30"
                  fill="white"
                >
                  <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"></path>
                </svg>
              </button>{" "}
              <p className="text-2xl font-bold text-white">
                {MAX_NAME_LENGTH - (editingDevices[device.id] || "").length}
              </p>
            </Fragment>
          ) : (
            <Fragment>
              <h2 className="text-2xl font-bold text-white align flex items-center overflow-fix">
                Owner: {device.ownerName || ""}
              </h2>
              <a
                className="hover:cursor-pointer"
                onClick={() => toggleEdit(device.id)}
              >
                {" "}
                Edit{" "}
              </a>{" "}
            </Fragment>
          )}
        </div>
        <p className="text-2xl font-bold text-white ml-auto flex flex-row gap-3">
          {device.batteryLevel || ""}%
        </p>
      </div>
    );
  };

  const toggleEdit = (deviceId: string) => {
    setEditingDevices((prevEditingDevices) => ({
      ...prevEditingDevices,
      [deviceId]: devices.find((dev) => dev.id === deviceId)?.ownerName || "",
    }));
  };

  return (
    <div className="w-full h-full flex flex-col p-10 ">
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0">
        {orgName} Devices
      </h2>
      <div className="flex p-5 w-full">
        <button className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[150px] bg-[#606060] text-white">
          Fetch
        </button>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {devices.length > 0 ? (
          devices.map((device: Device) => {
            return Device(device);
          })
        ) : (
          <h2 className="text-2xl font-bold text-white">No Devices Found.</h2>
        )}
      </div>
    </div>
  );
};

export default DevicesDemo;
