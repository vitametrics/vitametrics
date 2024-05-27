import { Fragment } from "react";
import { useProject } from "../../../helpers/ProjectContext";
import Pagination from "../../Pagination";
import usePagination from "../../../hooks/usePagination";
import PaginationControls from "../PaginationControls";
import OverviewDevicesList from "./OverviewDevicesList";
import useSearch from "../../../hooks/useDeviceSearch"; // Ensure correct path

const OverviewDevices = () => {
  const { project } = useProject();
  const itemsPerPageOptions = [5, 10, 15, 20];
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
  } = usePagination();

  const { searchTerm, handleSearchChange, filteredItems } = useSearch(
    project.devices,
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

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-10">
      <h2 className="text-2xl text-primary font-bold mb-3">Devices</h2>
      {project.devices && project.devices.length === 0 ? (
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
          <OverviewDevicesList devices={currentDevices} />
          <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>

          <div
            id="pagination"
            className="flex flex-row mt-auto ml-auto items-center"
          >
            <Pagination
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default OverviewDevices;
