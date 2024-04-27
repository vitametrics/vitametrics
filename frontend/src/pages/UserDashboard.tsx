/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardNavbar } from "../components/DashboardNavbar";
import StickySidebar from "../components/StickySidebar";
import { useCallback } from "react";
import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Members from "../components/Dashboard-Views/Members";
import Settings from "../components/Dashboard-Views/Settings";
import Footer from "../components/Footer";
import { useAuth } from "../helpers/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useDashboard } from "../helpers/DashboardContext";

const Dashboard = () => {
  const { isAccountLinked } = useAuth();
  const { showBackDrop } = useDashboard();
  const [searchParams, setSearchParams] = useSearchParams({ view: "data" });
  const view = searchParams.get("view") || "data";
  const setPage = (newView: string) => {
    setSearchParams({ view: newView }, { replace: true });
  };

  const oAuthLogin = async () => {
    window.location.href = "https://vitametrics.org/api/auth";
  };

  const renderComponent = useCallback(() => {
    switch (view) {
      case "data":
        return <Data />;
      case "devices":
        return <Devices />;
      case "members":
        return <Members />;
      case "settings":
        return <Settings />;
      default:
        return <Data />;
    }
  }, [view]);

  return (
    <div className="h-full font-ralewayBold  bg-[#1E1D20] bg-hero-texture">
      <DashboardNavbar />
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>
      <div className="flex flex-row">
        <div className="w-[125px]">
          <StickySidebar setPage={setPage} path="dashboard" />
        </div>
        <div className="flex w-full h-full flex-col ">
          {!isAccountLinked && (
            <button
              onClick={oAuthLogin}
              className="p-2 text-white bg-red-400 hover:bg-[#8e5252]"
            >
              ALERT: Authenticate Your Fitbit Account{" "}
            </button>
          )}
          {renderComponent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
