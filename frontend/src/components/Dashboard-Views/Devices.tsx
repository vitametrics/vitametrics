/* eslint-disable @typescript-eslint/no-unused-vars */
import ConnectIcon from "../../assets/ConnectIcon";
import FiftyPercentIcon from "../../assets/FiftyPercentIcon";
import { useOrg } from "../../helpers/OrgContext";
import { useDashboard } from "../../helpers/DashboardContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Fragment, useState } from "react";
import EditButton from "../EditButton";

const MAX_NAME_LENGTH = 15;
interface Device {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  ownerName: string;
}

const Devices = () => {
  const {
    devices,
    setDevices,
    orgName,
    deviceViewDevices,
    setDeviceViewDevices,
  } = useOrg();
  const { fetchWorkingDevice } = useDashboard();
  const [editingDevices, setEditingDevices] = useState<{
    [key: string]: string;
  }>({});

  const FETCH_DEVICES_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_DEVICES_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_DEVICES_DEV_ENDPOINT;

  const NAME_CHANGE_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_NAME_CHANGE_ENDPOINT
      : import.meta.env.VITE_APP_NAME_CHANGE_DEV_ENDPOINT;

  const handleFetchDevices = async () => {
    fetchWorkingDevice();
    try {
      const response = await axios.post(FETCH_DEVICES_ENDPOINT!, {
        withCredentials: true,
      });

      console.log(response.data);
      setDevices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleEdit = (deviceId: string) => {
    setEditingDevices((prevEditingDevices) => ({
      ...prevEditingDevices,
      [deviceId]: devices.find((dev) => dev.id === deviceId)?.ownerName || "",
    }));
  };

  const Device = (device: Device) => {
    const isEditing = editingDevices[device.id] !== undefined;

    const handleOwnerNameChange = async () => {
      try {
        const response = await axios.post(
          NAME_CHANGE_ENDPOINT!,
          {
            deviceId: device.id,
            ownerName: editingDevices[device.id],
          },
          { withCredentials: true }
        );

        console.log(response.data);
        setDevices(response.data); //ask sean to return the updated devices
        setDeviceViewDevices(response.data);
        setEditingDevices((prevEditingDevices) => {
          const { [device.id]: removed, ...rest } = prevEditingDevices;
          return rest;
        });
      } catch (error) {
        console.log(error);
      }

      //test code -- can be used for demo
      const updatedOwnerName = editingDevices[device.id];
      const updatedDevices = devices.map((d) =>
        d.id === device.id ? { ...d, ownerName: updatedOwnerName } : d
      );
      const updatedTestDevices = deviceViewDevices.map((d) =>
        d.id === device.id ? { ...d, ownerName: updatedOwnerName } : d
      );
      setDevices(updatedDevices);
      setDeviceViewDevices(updatedTestDevices);
      setEditingDevices((prevEditingDevices) => {
        const { [device.id]: removed, ...rest } = prevEditingDevices;
        return rest;
      });
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
                onChange={(e) =>
                  setEditingDevices((prevEditingDevices) => ({
                    ...prevEditingDevices,
                    [device.id]: e.target.value,
                  }))
                }
              />
              <button onClick={handleOwnerNameChange}>Save</button>
              {/*render character limit going down*/}
              <p className="text-2xl font-bold text-white">
                {MAX_NAME_LENGTH - (editingDevices[device.id] || "").length}
              </p>
            </Fragment>
          ) : (
            <Fragment>
              <h2 className="text-2xl font-bold text-white align flex items-center overflow-fix">
                Owner: {device.ownerName || ""}
              </h2>
              <EditButton onClick={() => toggleEdit(device.id)} />
            </Fragment>
          )}
        </div>
        <p className="text-2xl font-bold text-white ml-auto flex flex-row gap-3">
          {device.batteryLevel || ""}
          <FiftyPercentIcon />
        </p>
      </div>
    );
  };

  const fadeInItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const { ref, inView } = useInView({
    threshold: 0.1, // Adjust based on when you want the animation to trigger (1 = fully visible)
    triggerOnce: true, // Ensures the animation only plays once
  });

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 "
    >
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0">
        {orgName} Devices
      </h2>
      <div className="flex p-5 w-full">
        <button
          onClick={handleFetchDevices}
          className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[150px] bg-[#606060] text-white"
        >
          <ConnectIcon />
          Fetch
        </button>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {devices.length > 0 ? (
          deviceViewDevices.map((device: Device) => {
            return Device(device);
          })
        ) : (
          <h2 className="text-2xl font-bold text-white">No Devices Found.</h2>
        )}
      </div>
    </motion.div>
  );
};

export default Devices;
