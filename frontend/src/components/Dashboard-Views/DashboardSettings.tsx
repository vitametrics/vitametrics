import { fadeInItemVariants } from "../../hooks/animationVariant";
import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { useProject } from "../../helpers/ProjectContext";
import ChangeNameField from "../Dashboard/DashboardSettings/ChangeNameField";
import ChangeDescriptionField from "../Dashboard/DashboardSettings/ChangeDescription";
import ChangeOwnerEmailField from "../Dashboard/DashboardSettings/ChangeEmailField";

const DashboardSettings = () => {
  const { ref, inView } = useCustomInView();
  const { projectName } = useProject();

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-[3.75rem] text-primary "
    >
      <h2 className="w-full text-4xl font-libreFranklin font-bold mb-10">
        {projectName} Settings
      </h2>
      <div className="flex flex-col gap-5">
        <span className="mb-10">
          <h2 className="text-2xl font-bold">Change Project Name</h2>
          <ChangeNameField />
        </span>
        <span className="mb-10">
          <h2 className="text-2xl font-bold">Change Project Description</h2>
          <ChangeDescriptionField />
        </span>
        <span className="mb-10">
          <h2 className="text-2xl font-bold">Change Owner Email</h2>
          <ChangeOwnerEmailField />
        </span>

        <span className="mb-10">
          <h2 className="text-2xl font-bold">Delete Project</h2>
          <p className="text-secondary text-md">
            DISCLAIMER: This action is not reversible
          </p>

          <button className="p-4 w-[300px] bg-red-500 text-white rounded-lg font-bold">
            Delete Project
          </button>
        </span>
      </div>
    </motion.div>
  );
};
export default DashboardSettings;
