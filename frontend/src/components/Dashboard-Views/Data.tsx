/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-datepicker/dist/react-datepicker.css";

import { useSearchParams } from "react-router-dom";
import "chart.js/auto";
import { useProject } from "../../helpers/ProjectContext";
import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import DataOverview from "../Dashboard/Data/DataOverview";
import DownloadHistory from "../Dashboard/Data/DownloadHistory";

const Data = () => {
  const { ref, inView } = useCustomInView();

  const { project } = useProject();
  const [searchParams, setSearchParams] = useSearchParams({
    tab: "overview",
  });
  const tab = searchParams.get("tab");

  const handleTabChange = (tab: string) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", tab);
        return prev;
      },
      { replace: true }
    );
  };

  const renderTab = () => {
    switch (tab) {
      case "overview":
        return <DataOverview />;
      case "download-history":
        return <DownloadHistory />;
      default:
        return <DataOverview />;
    }
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
    >
      <h2 className="w-full text-4xl text-primary p-5 pb-0 mb-5 font-bold">
        {project.projectName} Data
      </h2>

      <div className="p-5 flex flex-col">
        <span className="flex flex-row ">
          <button
            className={`p-3 text-white font-bold rounded-tl rounded-bl  hover:bg-primary shadow-lg w-[200px] ${tab === "overview" ? "bg-primary" : "bg-primary2"}`}
            onClick={() => handleTabChange("overview")}
          >
            Overview
          </button>
          <button
            className={`p-3 text-white font-bold rounded-tr rounded-br  hover:bg-primary shadow-lg w-[200px] ${tab === "download-history" ? "bg-primary" : "bg-primary2"}`}
            onClick={() => handleTabChange("download-history")}
          >
            Download History
          </button>
        </span>
      </div>
      <div className="p-5 w-full flex flex-col">{renderTab()}</div>
    </motion.div>
  );
};

export default Data;
