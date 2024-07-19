import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../../helpers/AuthContext";

const AdminOverview = () => {
  const { ref, inView } = useCustomInView();
  const { currVersion, latestVersion, fetchVersion, isUpToDate } = useAuth();

  useEffect(() => {
    console.log("called!");
    if (!currVersion) {
      fetchVersion();
    }
  }, []);

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-neueHassUnica"
    >
      <h1 className="w-full text-4xl font-bold text-primary pb-0 mb-5">
        Admin Overview
      </h1>
      <button
        onClick={() => fetchVersion()}
        className="bg-primary text-white p-2 w-[200px] rounded-lg"
      >
        Check For Updates
      </button>
      <div className="flex flex-col mt-5">
        <span
          className={`w-full h-[5px] ${isUpToDate ? "bg-green-400" : "bg-logoColor"}`}
        />
        <span className="bg-primary2 w-full text-white p-3 font-bold text-xl">
          Application Version
        </span>
        <span className="bg-primary w-full text-white p-3 text-lg">
          {isUpToDate
            ? `Up to date -- Your current version is ${currVersion}`
            : `Update available: Your current version is ${currVersion} and the latest version is ${latestVersion}`}
        </span>
      </div>
    </motion.div>
  );
};

export default AdminOverview;
