import Navbar from "../components/Navbar";
import StickySidebar from "../components/StickySidebar";
import { useState } from "react";

import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Members from "../components/Dashboard-Views/Members";
import Settings from "../components/Dashboard-Views/Settings";

const Dashboard = () => {
  const [page, setPage] = useState("Data");

  const renderComponent = () => {
    console.log(page);
    switch (page) {
      case "Data":
        return <Data />;
      case "Devices":
        return <Devices />;
      case "Members":
        return <Members />;
      case "Settings":
        return <Settings />;
      default:
        return <p>Hello, World! from the Dashboard</p>;
    }
  };

  return (
    <div className="h-screen font-ralewayBold">
      <Navbar />
      <div className="flex flex-row">
        <div className="w-[150px]">
          <StickySidebar setPage={setPage} />
        </div>
        <div className="flex w-full h-full">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
