import Pagination from "../../Pagination/Pagination";
import usePagination from "../../../hooks/usePagination";
import PaginationControls from "../../Pagination/PaginationControls";
import MembersList from "./MembersList";
import useSearch from "../../../hooks/useSearch";
import { Fragment, useState } from "react";
import { MembersContainerProps } from "../../../types/Member";
import { useAuth } from "../../../helpers/AuthContext";

const MembersContainer: React.FC<MembersContainerProps> = ({
  onClick,
  toggleInviteMenu,
}) => {
  const { siteMembers, isOwner } = useAuth();
  const itemsPerPageOptions = [5, 10, 15, 20];
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
  } = usePagination();
  const [selectedRole, setSelectedRole] = useState(""); // State to track the selected role

  const { searchTerm, handleSearchChange, filteredItems } = useSearch(
    siteMembers.filter((member) =>
      selectedRole === ""
        ? member
        : selectedRole === "admin"
          ? member.isAdmin
          : selectedRole === "owner"
            ? member.isOwner
            : selectedRole === "guest"
              ? member.isTempUser
              : member.role === "user"
    ),
    setCurrentPage
  );

  const indexOfLastMember = Math.min(
    currentPage * itemsPerPage,
    filteredItems.length
  );
  const indexOfFirstMember = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredItems.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-10 mb-12 border-2 border-gray-300">
      <h2 className="text-2xl text-primary font-bold mb-3">
        Your Instance's Members
      </h2>
      {isOwner && (
        <button
          onClick={() => toggleInviteMenu(true)}
          className="p-2 bg-primary hover:bg-hoverPrimary text-white rounded mb-5 text-lg w-[150px] mr-auto font-bold"
        >
          Invite Admin
        </button>
      )}

      {siteMembers && siteMembers.length === 0 ? (
        <span className="text-primary text-lg">No members found</span>
      ) : (
        <Fragment>
          <div className="flex flex-row text-primary items-center mb-3">
            <span>Filter by Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className=" w-[100px] ml-2 border-2 border-gray-200 rounded-lg"
            >
              <option value="">All</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Participant</option>
            </select>
          </div>
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
          <MembersList members={currentMembers} onClick={onClick} />
          {currentMembers.length !== 0 && (
            <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>
          )}

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

export default MembersContainer;
