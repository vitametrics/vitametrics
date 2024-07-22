import { fadeInItemVariants } from "../../hooks/animationVariant";
import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { useProject } from "../../helpers/ProjectContext";
import { useAuth } from "../../helpers/AuthContext";
import ChangeNameField from "../Dashboard/DashboardSettings/ChangeNameField";
import ChangeDescriptionField from "../Dashboard/DashboardSettings/ChangeDescription";
import ChangeOwnerEmailField from "../Dashboard/DashboardSettings/ChangeEmailField";
import DeleteProjectMenu from "../Menus/DeleteProjectMenu";
import { Fragment } from "react";
import { deleteProjectService } from "../../services/projectService";
import { useState } from "react";
import NotificationToggle from "../Dashboard/DashboardSettings/NotificationToggle";

const DashboardSettings = () => {
  const { ref, inView } = useCustomInView();
  const { project, setShowBackDrop } = useProject();
  const { projects, setProjects } = useAuth();
  const [deleteProject, setDeleteProject] = useState(false);

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

      <h2 className="w-full text-2xl font-bold mb-3">
        {project.projectName} Settings
      </h2>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Toggle Email Notifications</h2>
        <NotificationToggle />

        <span className="mb-5">
          <ChangeNameField />
        </span>
        <span className="mb-5">
          <ChangeDescriptionField />
        </span>
        {project.isOwner && (
          <Fragment>
            <span className="mb-5">
              <ChangeOwnerEmailField />
            </span>
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
          </Fragment>
        )}
      </div>
    </motion.div>
  );
};
export default DashboardSettings;
