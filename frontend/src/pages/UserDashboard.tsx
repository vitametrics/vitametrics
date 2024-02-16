import Navbar from "../components/Navbar";
import StickySidebar from "../components/StickySidebar";
import { useState, useEffect, useCallback } from "react";

import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Members from "../components/Dashboard-Views/Members";
import Settings from "../components/Dashboard-Views/Settings";
import Footer from "../components/Footer";
import { useAuth } from "../helpers/AuthContext";
import axios from "axios";

const Dashboard = () => {
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT;
  const { isAuthenticated } = useAuth();
  const OAUTH_ENDPOINT = import.meta.env.VITE_APP_OAUTH_ENDPOINT;

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }),
    [isAuthenticated];

  const oAuthLogin = async () => {
    try {
      const response = await axios.get(OAUTH_ENDPOINT, {
        withCredentials: true,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [page, setPage] = useState("Data");
  const [showBackdrop, setShowBackdrop] = useState(false);

  const renderComponent = useCallback(() => {
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
  }, [page]); // Only recompute if `page` changes

  return (
    <div className="h-full font-ralewayBold">
      {showBackdrop && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
          onClick={() => setShowBackdrop(false)} // Close the backdrop when clicked
        />
      )}
      <Navbar />
      <button onClick={oAuthLogin}> </button>
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
