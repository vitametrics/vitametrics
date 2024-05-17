import DataIcon from "../assets/DataIcon";
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
        <li
          className={`${
            currentPage === "Data" ? " bg-secondary2" : ""
          } flex-col flex justify-center items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Data")}
        >
          <DataIcon />
          Data
        </li>
        <li
          className={`${
            currentPage === "Devices" ? " bg-secondary2" : ""
          } flex-col flex justify-center items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Devices")}
        >
          <DeviceIcon />
          Devices
        </li>
        <li
          className={`${
            currentPage === "Members" ? " bg-secondary2" : ""
          } flex-col flex justify-center items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Members")}
        >
          <MembersIcon />
          Members
        </li>
        <li
          className={`${
            currentPage === "Settings" ? "bg-secondary2" : ""
          } flex-col flex justify-center items-center text-white hover:bg-secondary2 p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Settings")}
        >
          <SettingsIcon />
          Settings
        </li>
      </ul>
    </div>
  );
};

export default StickySidebar;
