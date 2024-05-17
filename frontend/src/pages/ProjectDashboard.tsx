/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardNavbar } from "../components/DashboardNavbar";
import StickySidebar from "../components/StickySidebar";
import { useCallback } from "react";
import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Members from "../components/Dashboard-Views/Members";
import Settings from "../components/Dashboard-Views/Settings";
import Footer from "../components/Footer";
import AuthenticationBanner from "../components/Dashboard/AuthenticationBanner";
import { useSearchParams } from "react-router-dom";
import { useProject } from "../helpers/ProjectContext";

const ProjectDashboard = () => {
  const { showBackDrop } = useProject();
  const [searchParams, setSearchParams] = useSearchParams({ view: "data" });
  const view = searchParams.get("view") || "data";
  const id = searchParams.get("id");
  console.log(id);
  const setPage = (newView: string) => {
    setSearchParams({ view: newView }, { replace: true });
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
    <div className="h-full font-libreFranklin bg-whitePrimary text-black">
      <DashboardNavbar />
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>
      <div className="flex flex-row">
        <div className="w-[100px]">
          <StickySidebar setPage={setPage} path="dashboard/project" />
        </div>
        <div className="flex w-full h-full flex-col ">
          <AuthenticationBanner />
          {renderComponent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDashboard;
