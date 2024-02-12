import Navbar from "../components/Navbar";
import StickySidebar from "../components/StickySidebar";
import { useState, useEffect } from "react";

import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Members from "../components/Dashboard-Views/Members";
import Settings from "../components/Dashboard-Views/Settings";
import Footer from "../components/Footer";

import axios from "axios";

const Dashboard = () => {
  const [page, setPage] = useState("Data");
  const orgId = sessionStorage.getItem("orgId");
  const [showBackdrop, setShowBackdrop] = useState(false);

  const fetchOrg = async () => {
    try {
      const response = await axios.get("http://localhost:7970/user/org/info", {
        params: {
          orgId: orgId,
        },
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //use effect to fetch org upon load
  useEffect(() => {
    fetchOrg();
  }, [page]); // Include 'fetchOrg' in the dependency array

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
        return <Data />;
    }
  };

  return (
    <div className="h-full font-ralewayBold">
      {showBackdrop && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
          onClick={() => setShowBackdrop(false)} // Close the backdrop when clicked
        />
      )}
      <Navbar />
      <div className="flex flex-row">
        <div className="w-[150px]">
          <StickySidebar setPage={setPage} />
        </div>
        <div className="flex w-full h-full">{renderComponent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
