import { DashboardNavbar } from "../components/DashboardNavbar";
import StickySidebar from "../components/StickySidebar";
import { useCallback } from "react";
import DataDemo from "../components/Demo-Views/DataDemo";
import DevicesDemo from "../components/Demo-Views/DevicesDemo";
import MembersDemo from "../components/Demo-Views/MembersDemo";
import SettingsDemo from "../components/Demo-Views/SettingsDemo";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";

const Demo = () => {
  const [searchParams, setSearchParams] = useSearchParams({view:"data"})
  const view = searchParams.get("view") || "data";
  const setPage = (newView: string) => {
    setSearchParams({ "view": newView }, { replace: true } );
  };

  const renderComponent = useCallback(() => {
    switch (view) {
      case "data":
        return <DataDemo />;
      case "devices":
        return <DevicesDemo />;
      case "members":
        return <MembersDemo />;
      case "settings":
        return <SettingsDemo />;
      default:
        return <DataDemo />;
    }
  }, [view]);

  return (
    <div className="h-full font-ralewayBold bg-hero-texture">
      <DashboardNavbar />
      <div className="flex flex-row">
        <div className="w-[125px]">
          <StickySidebar setPage={setPage} path={"demo"} />
        </div>
        <div className="flex w-full h-full flex-col ">{renderComponent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Demo;
