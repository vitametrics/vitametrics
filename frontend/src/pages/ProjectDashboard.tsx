/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardNavbar } from "../components/DashboardNavbar";
import StickySidebar from "../components/StickySidebar";
import { useCallback, useEffect } from "react";
import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Overview from "../components/Dashboard-Views/Overview";
import Members from "../components/Dashboard-Views/Members";
import DashboardSettings from "../components/Dashboard-Views/DashboardSettings";
import AuthenticationBanner from "../components/Dashboard/AuthenticationBanner";
import ViewDevice from "../components/Dashboard-Views/ViewDevice";
import { useSearchParams } from "react-router-dom";
import { useProject } from "../helpers/ProjectContext";

const ProjectDashboard = () => {
  const { showBackDrop, isAccountLinked } = useProject();
  const [searchParams, setSearchParams] = useSearchParams({ view: "overview" });
  const view = searchParams.get("view") || "overview";
  const setPage = (newView: string) => {
    setSearchParams({ view: newView }, { replace: true });
  };

  useEffect(() => {
    if (searchParams.get("id") === "null") {
      window.location.href = "/dashboard";
    }
  }, []);

  const renderComponent = useCallback(() => {
    switch (view) {
      case "overview":
        return <Overview />;
      case "data":
        return <Data />;
      case "devices":
        return <Devices />;
      case "members":
        return <Members />;
      case "settings":
        return <DashboardSettings />;
      case "device":
        return <ViewDevice />;
      default:
        return <Data />;
    }
  }, [view]);

  return (
    <div className="h-full font-libreFranklin bg-whitePrimary text-black">
      <DashboardNavbar />
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>
      <div className="flex flex-row">
        <div className="w-[75px]">
          <StickySidebar setPage={setPage} path="dashboard/project" />
        </div>
        <div className="flex w-full h-full flex-col">
          {!isAccountLinked && <AuthenticationBanner />}
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
