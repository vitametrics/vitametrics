import DataIcon from "../assets/DataIcon";
import OverviewIcon from "../assets/OverviewIcon";
import DeviceIcon from "../assets/DeviceIcon";
import MembersIcon from "../assets/MembersIcon";
import SettingsIcon from "../assets/SettingsIcon";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface StickySidebarProps {
  setPage: (arg0: string) => void;
  path: string;
}

const StickySidebar: React.FC<StickySidebarProps> = ({ setPage, path }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Data");
  const id = new URLSearchParams(window.location.search).get("id");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view") || "data";
    if (view !== currentPage) {
      setCurrentPage(view);
    }
  }, []);

  const handlePageChange = (newPage: string) => {
    if (newPage !== currentPage) {
      setPage(newPage);
      setCurrentPage(newPage);
      navigate(`/${path}?id=${id}&&view=${newPage.toLowerCase()}`);
    }
  };

  return (
    <div className="sticky z-5 top-0 h-screen bg-primary">
      <ul className="flex flex-col">
        <li className="px-2 pt-2">
          <div
            className={`${
              currentPage === "Overview" ? " bg-secondary2" : ""
            } flex-col flex text-[0.75rem] px-4 py-2 justify-center rounded-xl items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
            onClick={() => handlePageChange("Overview")}
          >
            <OverviewIcon />
            Home
          </div>
        </li>

        <li className="px-2 pt-2">
          <div
            className={`${
              currentPage === "Data" ? " bg-secondary2" : ""
            } flex-col flex justify-center text-[0.75rem] px-4 py-2 rounded-xl items-center text-white hover:bg-secondary2 hover:cursor-pointer`}
            onClick={() => handlePageChange("Data")}
          >
            <DataIcon />
            Data
          </div>
        </li>
        <li className="px-2 pt-2">
          <div
            className={`${
              currentPage === "Devices" ? " bg-secondary2" : ""
            } flex-col flex justify-center text-[0.75rem] px-4 py-2 rounded-xl items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
            onClick={() => handlePageChange("Devices")}
          >
            <DeviceIcon />
            Devices
          </div>
        </li>
        <li className="px-2 pt-2">
          <div
            className={`${
              currentPage === "Members" ? " bg-secondary2" : ""
            } flex-col flex justify-center text-[0.75rem] px-4 py-2 rounded-xl items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
            onClick={() => handlePageChange("Members")}
          >
            <MembersIcon />
            Members
          </div>
        </li>
        <li className="px-2 pt-2">
          <div
            className={`${
              currentPage === "Settings" ? "bg-secondary2" : ""
            } flex-col flex justify-center text-[0.75rem] px-4 py-2 rounded-xl items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
            onClick={() => handlePageChange("Settings")}
          >
            <SettingsIcon />
            Settings
          </div>
        </li>
      </ul>
    </div>
  );
};

export default StickySidebar;
