const MAX_NAME_LENGTH = 15;
import { Fragment } from "react";
import { Device as DeviceType } from "../../../types/Device";

const Device = ({
  device,
  isEditing,
  editingDevices,
  setEditingDevices,
  handleOwnerNameChange,
}: {
  device: DeviceType;
  isEditing: boolean;
  editingDevices: Record<string, string>;
  setEditingDevices: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  handleOwnerNameChange: (deviceId: string) => void;
}) => (
  <div className="grid grid-cols-4 w-full h-[70px] bg-primary shadow-lg rounded-xl text-white p-5">
    <p className="text-2xl font-bold mr-auto overflow-fix">
      {device.deviceName || ""}
    </p>
    <h2 className="text-2xl font-bold align flex items-center mr-3 overflow-fix">
      ID: {device.deviceId || ""}
    </h2>
    <div className="flex flex-row items-center gap-2">
      {isEditing ? (
        <Fragment>
          <input
            type="text"
            placeholder="Enter new owner name..."
            value={editingDevices[device.deviceId]}
            maxLength={MAX_NAME_LENGTH}
            className="text-black rounded-lg"
            onChange={(e) =>
              setEditingDevices((prev) => ({
                ...prev,
                [device.deviceId]: e.target.value,
              }))
            }
          />
          <button onClick={() => handleOwnerNameChange(device.deviceId)}>
            {/* SVG Icon */}
          </button>
          <p className="text-2xl font-bold">
            {MAX_NAME_LENGTH - (editingDevices[device.deviceId] || "").length}
          </p>
        </Fragment>
      ) : (
        <Fragment>
          <h2 className="text-2xl font-bold align flex items-center overflow-fix">
            Owner: {device.deviceName || ""}
          </h2>
          {/* SVG Icon */}
        </Fragment>
      )}
    </div>
    <p className="text-2xl font-bold ml-auto flex flex-row gap-3">
      {device.batteryLevel || ""}%{/* SVG Icon */}
    </p>
  </div>
);

export default Device;
