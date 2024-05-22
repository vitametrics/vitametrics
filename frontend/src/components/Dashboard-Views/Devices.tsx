/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useProject } from "../../helpers/ProjectContext";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";
import DevicesList from "../Dashboard/Devices/DevicesList";
import usePagination from "../../hooks/usePagination";
import useSearch from "../../hooks/useDeviceSearch";
import PaginationControls from "../../components/Dashboard/Overview/PaginationControls";
import Pagination from "../../components/Pagination";

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

  const itemsPerPageOptions = [5, 10, 15, 20];
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
  } = usePagination();

  const { searchTerm, handleSearchChange, filteredItems } = useSearch(
    deviceViewDevices,
    setCurrentPage
  );

  const indexOfLastMember = Math.min(
    currentPage * itemsPerPage,
    filteredItems.length
  );
  const indexOfFirstMember = (currentPage - 1) * itemsPerPage;
  const currentDevices = filteredItems.slice(
    indexOfFirstMember,
    indexOfLastMember
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

      {deviceViewDevices.length > 0 ? (
        <section className="p-5">
          <div className="flex flex-col bg-white rounded-xl shadow-lg p-10">
            <h2 className="text-2xl text-primary font-bold mb-5">Devices</h2>
            <button
              onClick={handleFetchDevices}
              className="p-2 text-xl flex flex-row gap-2 justify-center items-center rounded-xl w-[150px] bg-primary text-white shadow-lg font-bold mb-5"
            >
              {" "}
              Fetch{" "}
            </button>
            <input
              type="text"
              placeholder="Search For Name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 w-[300px] mr-auto border-2 border-gray-200 rounded-lg mb-2"
            />
            <PaginationControls
              itemsPerPage={itemsPerPage}
              handleItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={itemsPerPageOptions}
              totalItems={filteredItems.length}
              currentPage={currentPage}
              indexOfLastItem={indexOfLastMember}
            />
            <DevicesList devices={currentDevices} />
            <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>
            <Pagination
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </section>
      ) : (
        <div className="flex flex-col gap-5 p-5">
          <div className="flex p-5 w-full">
            <button
              onClick={handleFetchDevices}
              className="p-2 text-xl flex flex-row gap-2 justify-center items-center rounded-xl w-[150px] bg-primary text-white shadow-lg font-bold"
            >
              Fetch
            </button>
          </div>
          <h2 className="text-2xl font-bold text-primary">No Devices Found.</h2>
        </div>
      )}
    </motion.div>
  );
};

export default Devices;
