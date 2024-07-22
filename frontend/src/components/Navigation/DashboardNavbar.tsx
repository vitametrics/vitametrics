import logo from "../../assets/images/logo.webp";
import ProfileIcon from "../../assets/ProfileIcon";
import Dropdown from "./Dropdown";
import { useState } from "react";

export const DashboardNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav id="top" className="bg-primary2 px-5 ">
      <div className="flex flex-row w-full bg-primary2 top-0 flex-wrap items-center justify-between mx-auto py-3">
        <a
          href="/dashboard"
          className="flex items-center space-x-3 rtl:space-x-reverse mr-auto"
        >
          <img src={logo} className="h-[35px]" alt="vitametrics Logo" />
        </a>
        <div className="flex items-center space-x-3">
          <a
            className="text-white hover:cursor-pointer"
            onClick={toggleDropdown}
          >
            <ProfileIcon />
          </a>
          {dropdownOpen && <Dropdown />}
        </div>
      </div>
    </nav>
  );
};
