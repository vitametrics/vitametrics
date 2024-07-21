/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, Fragment } from "react";
//import axios from "axios";
import { motion } from "framer-motion";
import { useProject } from "../../helpers/ProjectContext";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";
import DevicesList from "../Dashboard/Devices/DevicesList";
import usePagination from "../../hooks/usePagination";
import useSearch from "../../hooks/useDeviceSearch";
import PaginationControls from "../Dashboard/PaginationControls";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";

const Devices = () => {
  const { projectDevices, project, fetchProjectDevices } = useProject();

  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("id") || "";

  const handleDeviceClick = (deviceId: string) => {
    setSearchParams(
      { id: projectId, view: "device", device: deviceId },
      { replace: true }
    );
  };
  const itemsPerPageOptions = [5, 10, 15, 20];
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
  } = usePagination();

  const devices = project.devices || [];

  const { searchTerm, handleSearchChange, filteredItems } = useSearch(
    devices,
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

  console.log(projectDevices);
  const { ref, inView } = useCustomInView();

  const handleFetchDevices = useCallback(() => {
    fetchProjectDevices();
  }, [fetchProjectDevices]);

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary"
    >
      <Fragment>
        <div className="flex flex-col  bg-white rounded-xl shadow-lg p-10 border-2 border-gray-300">
          <h2 className="text-2xl text-primary font-bold mb-5">
            {project.projectName} Devices
          </h2>
          <button
            onClick={handleFetchDevices}
            className="p-2 text-lg flex flex-row gap-2 justify-center items-center rounded w-[150px] bg-primary hover:bg-hoverPrimary text-white shadow-lg font-bold mb-5"
          >
            Fetch
          </button>
          {devices.length === 0 ? (
            <span className="text-primary text-lg">No devices found</span>
          ) : (
            <Fragment>
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

              <DevicesList
                devices={currentDevices}
                onDeviceClick={handleDeviceClick}
              />
              <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>
              <Pagination
                totalItems={filteredItems.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Fragment>
          )}
        </div>
      </Fragment>
    </motion.div>
  );
};

export default Devices;
