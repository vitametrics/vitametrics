import { motion } from "framer-motion";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";
import { useAuth } from "../../helpers/AuthContext";
import UnhealthyIcon from "../../assets/UnhealthyIcon";
import HealthyIcon from "../../assets/HealthyIcon";

const AdminServiceStatus = () => {
  const { ref, inView } = useCustomInView();
  const {
    frontendVersion,
    backendVersion,
    fetchVersion,
    isBackendUpToDate,
    isFrontendUpToDate,
  } = useAuth();

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
    >
      <h1 className="w-full text-4xl font-bold text-primary pb-0 mb-5">
        Admin Instance Status
      </h1>
      <button
        className="bg-secondary2 max-w-[200px] rounded-lg text-white font-bold p-2 hover:bg-secondary"
        onClick={() => fetchVersion()}
      >
        {" "}
        Check for Updates{" "}
      </button>
      <div className="flex flex-col mt-5">
        <span className="w-full h-[5px] bg-logoColor" />
        <span className="bg-primary2 w-full text-white p-3 font-bold text-xl">
          Health
        </span>
        <div className="flex flex-col">
          <div className="bg-primary w-full text-white p-3 text-lg custom-grid font-bold">
            <span></span>
            <span>Type</span>
            <span> Version</span>
            <span>Status</span>
            <span> Connection to Fitbit </span>
          </div>
          <div className="bg-primary w-full text-white p-3 text-lg custom-grid">
            <span>
              {isFrontendUpToDate ? <HealthyIcon /> : <UnhealthyIcon />}
            </span>
            <span>Client</span>
            <span>{frontendVersion}</span>
            <span>
              {isFrontendUpToDate ? "Up to date" : "Update available"}
            </span>
            <span> Good </span>
          </div>
          <div className="bg-primary w-full text-white p-3 text-lg custom-grid">
            <span>
              {isBackendUpToDate ? <HealthyIcon /> : <UnhealthyIcon />}{" "}
            </span>
            <span>Server</span>
            <span>{backendVersion}</span>
            <span>{isBackendUpToDate ? "Up to date" : "Update available"}</span>
            <span> Good </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminServiceStatus;
