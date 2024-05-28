import { fadeInItemVariants } from "../../hooks/animationVariant";
import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { useProject } from "../../helpers/ProjectContext";
import { useAuth } from "../../helpers/AuthContext";
import ChangeNameField from "../Dashboard/DashboardSettings/ChangeNameField";
import ChangeDescriptionField from "../Dashboard/DashboardSettings/ChangeDescription";
import ChangeOwnerEmailField from "../Dashboard/DashboardSettings/ChangeEmailField";
import DeleteProjectMenu from "../Dashboard/DeleteProjectMenu";
import { Fragment } from "react";
import {
  deleteProjectService,
  unlinkFitBitAccountService,
} from "../../services/projectService";
import { oAuthLogin } from "../../services/projectService";
import { useState } from "react";

const DashboardSettings = () => {
  const { ref, inView } = useCustomInView();
  const { project, setShowBackDrop, isAccountLinked, fetchProject } =
    useProject();
  const { projects, setProjects } = useAuth();
  const [deleteProject, setDeleteProject] = useState(false);
  const [msg, setMsg] = useState("");

  const toggleDeleteProjectMenu = (show: boolean) => {
    setDeleteProject(show);
    setShowBackDrop(show);
  };

  const handleDeleteProject = async () => {
    toggleDeleteProjectMenu(true);
    await deleteProjectService(project.projectId);
    setProjects(
      projects.filter((project) => project._id !== project.projectId)
    );
    setDeleteProject(false);
    setShowBackDrop(false);

    window.location.href = "/dashboard";
  };

  const handleUnlinkFitBitAccount = async () => {
    await unlinkFitBitAccountService();
    await fetchProject();

    if (isAccountLinked) {
      setMsg("An error occurred while unlinking FitBit account");
      return;
    }

    window.location.reload();
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className={`w-full h-full flex flex-col p-[3.75rem] text-primary`}
    >
      <DeleteProjectMenu
        toggleMenu={toggleDeleteProjectMenu}
        handleDelete={handleDeleteProject}
        show={deleteProject}
      />

      <h2 className="w-full text-2xl font-libreFranklin font-bold mb-3">
        {project.projectName} Settings
      </h2>

      <div className="flex flex-col gap-3">
        {isAccountLinked ? (
          <Fragment>
            {msg && <p className="text-red-500">{msg}</p>}
            <button
              className="p-2 bg-red-400 hover:bg-red-300 rounded w-[200px] text-white font-bold"
              onClick={() => handleUnlinkFitBitAccount()}
            >
              Unlink FitBit Account
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <button
              className="p-2 bg-secondary2 hover:bg-secondary rounded w-[200px] text-white font-bold"
              onClick={oAuthLogin}
            >
              Link FitBit Account
            </button>
          </Fragment>
        )}

        <span className="mb-5">
          <ChangeNameField />
        </span>
        <span className="mb-5">
          <ChangeDescriptionField />
        </span>
        <span className="mb-5">
          <ChangeOwnerEmailField />
        </span>
        {project.isOwner && (
          <span className="mb-10">
            <h2 className="text-lg font-bold">Delete Project</h2>
            <p className="text-secondary text-md">
              DISCLAIMER: This action is not reversible
            </p>

            <a href="#top">
              <button
                className="p-4 w-[300px] bg-red-500 text-white rounded-lg font-bold hover:bg-red-400"
                onClick={() => toggleDeleteProjectMenu(true)}
              >
                Delete Project
              </button>
            </a>
          </span>
        )}
      </div>
    </motion.div>
  );
};
export default DashboardSettings;
