import { useSearchParams } from "react-router-dom";
import { useProject } from "../../helpers/ProjectContext";
import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import DeviceCache from "../Dashboard/ViewDevice/DeviceCache";
import DeviceDetails from "../Dashboard/ViewDevice/DeviceDetails";
import DeviceDownloadPanel from "../Dashboard/ViewDevice/DeviceDownloadPanel";

const ViewDevice = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    view: "device",
    tab: "overview",
  });
  const { fetchDeviceDetails, projectId } = useProject();
  const tab = searchParams.get("tab") || "overview";
  const deviceId = searchParams.get("device") || "";
  const device = fetchDeviceDetails(deviceId);

  const handleTabChange = (tab: string) => {
    setSearchParams(
      {
        id: projectId,
        view: "device",
        device: deviceId,
        tab: tab,
      },
      { replace: true }
    );
  };

  const renderTab = () => {
    switch (tab) {
      case "overview":
        return <DeviceDetails device={device} />;
      case "download-cache":
        return <DeviceCache deviceId={device.deviceId} />;
      case "download-data":
        return <DeviceDownloadPanel deviceId={device.deviceId} />;
      default:
        return <DeviceDetails device={device} />;
    }
  };

  const { ref, inView } = useCustomInView();

  return (
    <motion.div
      variants={fadeInItemVariants}
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="w-full h-full flex flex-col p-10 font-neueHassUnica text-primary"
    >
      <span id="options" className="flex flex-row">
        <span
          className={`p-5 rounded-tl-lg ${tab === "overview" ? "shadow-lg bg-white font-bold" : "bg-[#f7f7f7]"} hover:cursor-pointer`}
          onClick={() => handleTabChange("overview")}
        >
          Device Details
        </span>
        <span
          className={`p-5 ${tab === "download-data" ? "shadow-lg bg-white font-bold" : "bg-[#f7f7f7]"} hover:cursor-pointer`}
          onClick={() => handleTabChange("download-data")}
        >
          Download Data
        </span>
        <span
          className={`p-5 rounded-tr-lg ${tab === "download-cache" ? "shadow-lg bg-white font-bold" : "bg-[#f7f7f7]"} hover:cursor-pointer`}
          onClick={() => handleTabChange("download-cache")}
        >
          Download Cache
        </span>
      </span>
      <div className="p-10 bg-white rounded-lg rounded-tl-none shadow-lg">
        {renderTab()}
      </div>
    </motion.div>
  );
};

export default ViewDevice;
