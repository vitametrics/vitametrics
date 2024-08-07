import { useProject } from "../../helpers/ProjectContext";
import Pagination from "../Pagination/Pagination";
import usePagination from "../../hooks/usePagination";
import PaginationControls from "../Pagination/PaginationControls";
import useSearch from "../../hooks/useAccountSearch";
import { Fragment, useState } from "react";
import AccountsList from "../Lists/AccountsList";
import { oAuthLogin } from "../../services/projectService";

const AccountsContainer = () => {
  const { project, projectId, fitbitAccounts } = useProject();
  const itemsPerPageOptions = [5, 10, 15, 20];
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
  } = usePagination();

  console.log("from AccountsContainer");
  console.log(fitbitAccounts);

  const [activeAccountId, setActiveAccountId] = useState("");
  const enableDropdown = (userId: string) => {
    if (activeAccountId === userId) {
      setActiveAccountId("");
      return;
    }
    setActiveAccountId(userId);
  };

  const { searchTerm, handleSearchChange, filteredItems } = useSearch(
    fitbitAccounts,
    setCurrentPage
  );

  const indexOfLastAccount = Math.min(
    currentPage * itemsPerPage,
    filteredItems?.length
  );
  const indexOfFirstAccount = (currentPage - 1) * itemsPerPage;
  const currentAccounts = filteredItems?.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-10 mb-12 border-2 border-gray-300">
      <h2 className="text-2xl text-primary font-bold mb-3">
        {project.projectName} Fitbit Accounts
      </h2>
      {(project.isOwner || project.isAdmin) && (
        <button
          onClick={() => oAuthLogin(projectId)}
          className="p-1 text-lg flex flex-row gap-2 mb-5 justify-center items-center rounded w-[150px] bg-primary font-bold text-white shadow-lg hover:bg-hoverPrimary"
        >
          Link
        </button>
      )}
      {fitbitAccounts && fitbitAccounts?.length === 0 ? (
        <span className="text-primary text-lg">No accounts found</span>
      ) : (
        <Fragment>
          <div className="flex flex-row text-primary items-center mb-3"></div>
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
            totalItems={filteredItems?.length || 0}
            currentPage={currentPage}
            indexOfLastItem={indexOfLastAccount}
          />
          <AccountsList
            accounts={currentAccounts}
            onClick={enableDropdown}
            activeAccountId={activeAccountId}
          />
          {currentAccounts?.length !== 0 && (
            <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>
          )}

          <div
            id="pagination"
            className="flex flex-row mt-auto ml-auto items-center"
          >
            <Pagination
              totalItems={filteredItems?.length || 0}
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

export default AccountsContainer;
