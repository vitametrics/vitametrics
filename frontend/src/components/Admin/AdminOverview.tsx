import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../../helpers/AuthContext";

const AdminOverview = () => {
  const { ref, inView } = useCustomInView();
  const [uptodate] = useState(true);
  const { frontendVersion, backendVersion, fetchVersion } = useAuth();

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
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
        <span className="w-full h-[5px] bg-logoColor" />
        <span className="bg-primary2 w-full text-white p-3 font-bold text-xl">
          Application Version
        </span>
        <span className="bg-primary w-full text-white p-3 text-lg">
          {uptodate
            ? `Up to date -- Frontend: ${frontendVersion} Backend: ${backendVersion}`
            : "Update available: Your current version is 0.11.1 and the latest version is 0.11.2"}
        </span>
      </div>
    </motion.div>
  );
};

export default AdminOverview;
