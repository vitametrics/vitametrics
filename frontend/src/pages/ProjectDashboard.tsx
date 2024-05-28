/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardNavbar } from "../components/DashboardNavbar";
import StickySidebar from "../components/StickySidebar";
import { useCallback, useEffect } from "react";
import Devices from "../components/Dashboard-Views/Devices";
import Overview from "../components/Dashboard-Views/Overview";
import Members from "../components/Dashboard-Views/Members";
import DashboardSettings from "../components/Dashboard-Views/DashboardSettings";
import ViewDevice from "../components/Dashboard-Views/ViewDevice";
import { useSearchParams } from "react-router-dom";
import { useProject } from "../helpers/ProjectContext";

const ProjectDashboard = () => {
  const { showBackDrop } = useProject();
  const [searchParams, setSearchParams] = useSearchParams({ view: "overview" });
  const view = searchParams.get("view") || "overview";
  const setPage = (newView: string) => {
    setSearchParams({ view: newView }, { replace: true });
  };

  useEffect(() => {
    if (searchParams.get("id") === "null" || !searchParams.get("id")) {
      window.location.href = "/dashboard";
    }
  }, []);

  const renderComponent = useCallback(() => {
    switch (view) {
      case "overview":
        return <Overview />;
      case "devices":
        return <Devices />;
      case "members":
        return <Members />;
      case "settings":
        return <DashboardSettings />;
      case "device":
        return <ViewDevice />;
      default:
        return <Overview />;
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
        <div className="flex w-full h-full flex-col">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
