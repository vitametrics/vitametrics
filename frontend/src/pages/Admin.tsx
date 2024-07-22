/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardNavbar } from "../components/DashboardNavbar";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import AdminMembersManagement from "../components/Admin/AdminMembersManagement";
import AdminProjectManagement from "../components/Admin/AdminProjectManagement";
import AdminServiceStatus from "../components/Admin/AdminServiceStatus";
import AdminSettings from "../components/Admin/AdminSettings";
import AdminOverview from "../components/Admin/AdminOverview";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminAccounts from "../components/Admin/AdminAccounts";
import { useAuth } from "../helpers/AuthContext";

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams({ view: "overview" });
  const view = searchParams.get("view") || "overview";
  const { showBackDrop } = useAuth();

  const setPage = (newView: string) => {
    setSearchParams({ view: newView }, { replace: true });
  };

  const renderComponent = useCallback(() => {
    switch (view) {
      case "overview":
        return <AdminOverview />;
      case "settings":
        return <AdminSettings />;
      case "status":
        return <AdminServiceStatus />;
      case "members":
        return <AdminMembersManagement />;
      case "projects":
        return <AdminProjectManagement />;
      case "accounts":
        return <AdminAccounts />;
      default:
        return <AdminOverview />;
    }
  }, [view]);

  return (
    <div className="h-full font-neueHassUnica bg-whitePrimary text-black">
      <DashboardNavbar />
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>
      <div className="flex flex-row">
        <div className="w-[200px]">
          <AdminSidebar setPage={setPage} path="dashboard/admin" />
        </div>
        <div className="flex w-full h-full flex-col">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Admin;
