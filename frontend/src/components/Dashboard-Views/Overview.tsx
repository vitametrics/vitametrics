import { motion } from "framer-motion";
import { fadeInItemVariants } from "../../hooks/animationVariant"; // Adjust the path as necessary
import useCustomInView from "../../hooks/useCustomInView"; // Adjust the path to your custom hook
import { useProject } from "../../helpers/ProjectContext"; // Adjust the path as necessary
import OverviewMembers from "../Dashboard/OverviewMembers";
import OverviewDevices from "../Dashboard/OverviewDevices";

const Overview = () => {
  const { ref, inView } = useCustomInView();
  const { projectName, description } = useProject();

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
    >
      <h2 className="w-full text-4xl text-primary p-5 pb-0 mb-5 font-bold">
        {projectName} Overview
      </h2>
      <div className="p-5 w-full flex-col">
        <h2 className="text-2xl text-primary mb-5">{description}</h2>
        <OverviewMembers />
        <OverviewDevices />
      </div>
    </motion.div>
  );
};

export default Overview;
