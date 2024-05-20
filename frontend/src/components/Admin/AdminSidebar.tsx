import DataIcon from "../../assets/DataIcon";
import OverviewIcon from "../../assets/OverviewIcon";
import DeviceIcon from "../../assets/DeviceIcon";
import MembersIcon from "../../assets/MembersIcon";
import SettingsIcon from "../../assets/SettingsIcon";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  setPage: (arg0: string) => void;
  path: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ setPage, path }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("overview");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view") || "overview";
    if (view !== currentPage) {
      setCurrentPage(view);
    }
  }, []);

  const handlePageChange = (newPage: string) => {
    if (newPage !== currentPage) {
      setPage(newPage);
      setCurrentPage(newPage);
      navigate(`/${path}?view=${newPage.toLowerCase()}`);
    }
  };

  return (
    <div className="sticky z-5 top-0 h-screen bg-primary">
      <ul className="flex flex-col">
        <li className="text-sm text-white p-2 text-center bg-primary3 font-bold">
          {" "}
          ADMINISTRATION{" "}
        </li>
        <li
          className={`${
            currentPage === "overview" ? " bg-secondary2" : ""
          } flex-row flex text-[0.75rem] px-4 py-2 justify-start items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer gap-2`}
          onClick={() => handlePageChange("overview")}
        >
          <OverviewIcon />
          Home
        </li>

        <li
          className={`${
            currentPage === "settings" ? " bg-secondary2" : ""
          } flex-row flex text-[0.75rem] px-4 py-2 justify-start  items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer gap-2`}
          onClick={() => handlePageChange("settings")}
        >
          <DataIcon />
          Settings
        </li>
        <li className="text-sm text-white p-2 text-center bg-primary3 font-bold">
          {" "}
          MANAGEMENT{" "}
        </li>
        <li
          className={`${
            currentPage === "status" ? " bg-secondary2" : ""
          } flex-row flex text-[0.75rem] px-4 py-2 justify-start items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer gap-2`}
          onClick={() => handlePageChange("status")}
        >
          <DeviceIcon />
          Status
        </li>
        <li
          className={`${
            currentPage === "members" ? " bg-secondary2" : ""
          } flex-row flex text-[0.75rem] px-4 py-2 justify-start items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer gap-2`}
          onClick={() => handlePageChange("members")}
        >
          <MembersIcon />
          Members
        </li>
        <li
          className={`${
            currentPage === "projects" ? "bg-secondary2" : ""
          } flex-row flex text-[0.75rem] px-4 py-2 justify-start items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer gap-2`}
          onClick={() => handlePageChange("projects")}
        >
          <SettingsIcon />
          Projects
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
