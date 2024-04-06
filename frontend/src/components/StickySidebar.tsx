import DataIcon from "../assets/DataIcon";
import DeviceIcon from "../assets/DeviceIcon";
import MembersIcon from "../assets/MembersIcon";
import SettingsIcon from "../assets/SettingsIcon";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

interface StickySidebarProps {
  setPage: (arg0: string) => void;
}

const StickySidebar: React.FC<StickySidebarProps> = ({ setPage }) => {
  const history = useHistory();

  const [currentPage, setCurrentPage] = useState("Data");

  //useEffect to allocate the page to a variable
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view");
    if (view) {
      setPage(view);
      setCurrentPage(view);
    }
  }, [setPage]);

  const handlePageChange = (newPage: string) => {
    console.log("selected page: " + newPage);
    setPage(newPage);
    setCurrentPage(newPage);
    history.push(`/dashboard?view=${newPage.toLowerCase()}`); // Change the URL
  };

  return (
    <div className="sticky top-0 h-screen bg-[#222223]">
      <ul className="flex flex-col">
        <li
          className={`${
            currentPage === "Data" ? " bg-[#303030]" : ""
          } flex-col flex justify-center items-center text-white bg-[#222223] hover:bg-[#303030] p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Data")}
        >
          <DataIcon />
          <a>Data</a>
        </li>
        <li
          className={`${
            currentPage === "Devices" ? " bg-[#303030]" : ""
          } flex-col flex justify-center items-center text-white hover:bg-[#303030] p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Devices")}
        >
          <DeviceIcon />
          <a>Devices</a>
        </li>
        <li
          className={`${
            currentPage === "Members" ? " bg-[#303030]" : ""
          } flex-col flex justify-center items-center text-white hover:bg-[#303030] p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Members")}
        >
          <MembersIcon />
          <a>Members</a>
        </li>
        <li
          className={`${
            currentPage === "Settings" ? "bg-[#303030]" : ""
          } flex-col flex justify-center items-center text-white hover:bg-[#303030] p-4 hover:cursor-pointer`}
          onClick={() => handlePageChange("Settings")}
        >
          <SettingsIcon />
          <a>Settings</a>
        </li>
      </ul>
    </div>
  );
};

export default StickySidebar;
