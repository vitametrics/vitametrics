/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from "react";
import { useAuth } from "../../../helpers/AuthContext";
import ProjectsList from "../../Lists/ProjectsList";

interface ProjectsContainerProps {
  toggleCreateProjectMenu: (show: boolean) => void;
  toggleDeleteProjectMenu: (show: boolean, projectId: string) => void;
  handleProjectClick: (projectId: string) => void;
}

const ProjectsContainer: React.FC<ProjectsContainerProps> = ({
  toggleCreateProjectMenu,
  toggleDeleteProjectMenu,
  handleProjectClick,
}) => {
  const { siteProjects } = useAuth();
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg font-neueHassUnica p-10 border-2 border-gray-300">
      <span className="text-left text-primary text-2xl mr-auto mb-3 font-bold">
        Your Instance's Projects
      </span>
      <button
        onClick={() => toggleCreateProjectMenu(true)}
        className="p-2 bg-primary text-white rounded mb-5 text-xl w-[150px] mr-auto font-bold shadow-md"
      >
        New Project
      </button>

      {siteProjects && siteProjects.length === 0 ? (
        <span className="text-primary text-xl">No projects found</span>
      ) : (
        <Fragment>
          <div className="flex flex-col pt-0 h-full">
            <ProjectsList
              projects={siteProjects}
              handleProjectClick={handleProjectClick}
              toggleDeleteProjectMenu={toggleDeleteProjectMenu}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};
export default ProjectsContainer;
