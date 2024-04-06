import { DashboardNavbar } from "../components/DashboardNavbar";
import StickySidebar from "../components/StickySidebar";
import { useState, useCallback } from "react";
import DataDemo from "../components/Demo-Views/DataDemo";
import DevicesDemo from "../components/Demo-Views/DevicesDemo";
import MembersDemo from "../components/Demo-Views/MembersDemo";
import SettingsDemo from "../components/Demo-Views/SettingsDemo";
import Footer from "../components/Footer";
import { useHistory } from "react-router-dom";

const Demo = () => {
  const history = useHistory();
  const [page, setPage] = useState(window.location.search.split("=")[1]);

  if (page === undefined) {
    history.push("/demo?view=data");
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const renderComponent = useCallback(() => {
    switch (capitalizeFirstLetter(page)) {
      case "Data":
        return <DataDemo />;
      case "Devices":
        return <DevicesDemo />;
      case "Members":
        return <MembersDemo />;
      case "Settings":
        return <SettingsDemo />;
      default:
        return <DataDemo />;
    }
  }, [page]);

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
