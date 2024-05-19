/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useProject } from "../../helpers/ProjectContext";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";
import { Device as DeviceType } from "../../types/Device";
import Device from "../Dashboard/Devices/Device";

const NAME_CHANGE_ENDPOINT =
  import.meta.env.VITE_APP_NODE_ENV === "production"
    ? import.meta.env.VITE_APP_NAME_CHANGE_ENDPOINT
    : import.meta.env.VITE_APP_NAME_CHANGE_DEV_ENDPOINT;

const Devices = () => {
  const {
    setDevices,
    deviceViewDevices,
    setDeviceViewDevices,
    projectName,
    fetchDeviceViewDevices,
  } = useProject();
  const [editingDevices, setEditingDevices] = useState<Record<string, string>>(
    {}
  );

  console.log(deviceViewDevices);
  const { ref, inView } = useCustomInView();

  const handleOwnerNameChange = useCallback(
    async (deviceId: string) => {
      try {
        const ownerName = editingDevices[deviceId];
        const response = await axios.post(
          NAME_CHANGE_ENDPOINT,
          { deviceId, ownerName },
          { withCredentials: true }
        );
        setDevices(response.data);
        setDeviceViewDevices(response.data);
        setEditingDevices((prev) => {
          const { [deviceId]: removed, ...rest } = prev;
          return rest;
        });
      } catch (error) {
        console.error("Error changing owner name:", error);
      }
    },
    [editingDevices]
  );

  const handleFetchDevices = useCallback(() => {
    fetchDeviceViewDevices();
  }, [fetchDeviceViewDevices]);

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 whitePrimary"
    >
      <h2 className="w-full text-4xl font-bold p-5 text-primary pb-0">
        {projectName} Devices
      </h2>
      <div className="flex p-5 w-full">
        <button
          onClick={handleFetchDevices}
          className="p-2 text-xl flex flex-row gap-2 justify-center items-center rounded-xl w-[150px] bg-primary text-white shadow-lg font-bold"
        >
          Fetch
        </button>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {deviceViewDevices && deviceViewDevices.length > 0 ? (
          deviceViewDevices.map((device: DeviceType) => (
            <Device
              key={device.deviceId}
              device={device}
              isEditing={editingDevices[device.deviceId] !== undefined}
              editingDevices={editingDevices}
              setEditingDevices={setEditingDevices}
              handleOwnerNameChange={handleOwnerNameChange}
            />
          ))
        ) : (
          <h2 className="text-2xl font-bold text-primary">No Devices Found.</h2>
        )}
      </div>
    </motion.div>
  );
};

export default Devices;
