/* eslint-disable @typescript-eslint/no-unused-vars */
import { useOrg } from "../../helpers/OrgContext";
import { useDashboard } from "../../helpers/DashboardContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Fragment, useState } from "react";

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
                type="Enter new owner name..."
                value={editingDevices[device.id]}
                maxLength={MAX_NAME_LENGTH}
                className="text-black rounded-lg"
                onChange={(e) =>
                  setEditingDevices((prevEditingDevices) => ({
                    ...prevEditingDevices,
                    [device.id]: e.target.value,
                  }))
                }
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
              </button>
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.1719 0C14.4481 0 13.7244 0.275625 13.1719 0.828125L12.7071 1.29289C12.3166 1.68342 12.3166 2.31658 12.7071 2.70711L15.2929 5.29289C15.6834 5.68342 16.3166 5.68342 16.7071 5.29289L17.1719 4.82812C18.2759 3.72413 18.2759 1.93313 17.1719 0.828125C16.6194 0.275625 15.8956 0 15.1719 0ZM12.2071 3.20711C11.8166 2.81658 11.1834 2.81658 10.7929 3.20711L0.292894 13.7071C0.105357 13.8946 0 14.149 0 14.4142V17C0 17.5523 0.447715 18 1 18H3.58579C3.851 18 4.10536 17.8946 4.29289 17.7071L14.7929 7.20711C15.1834 6.81658 15.1834 6.18342 14.7929 5.79289L12.2071 3.20711Z"
                    fill="#4E4E4E"
                  />
                </svg>
              </a>
            </Fragment>
          )}
        </div>
        <p className="text-2xl font-bold text-white ml-auto flex flex-row gap-3">
          {device.batteryLevel || ""}%
          <svg
            width={46}
            height={30}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.019 7.2V0H.269v30h38.75v-7.2h6.25V7.2h-6.25zm-3.75 19.2H4.019V3.6h31.25v22.8zm6.25-7.2h-2.5v-8.4h2.5v8.4z"
              fill="#fff"
            />
            <path
              d="M13.393 7.8h-5v13.8h5V7.8zM22.144 7.8h-5v13.8h5V7.8z"
              fill="#fff"
            />
          </svg>
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
          Fetch
        </button>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {devices && devices.length > 0 ? (
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
