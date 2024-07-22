/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from "react";
import { useState } from "react";
import { useAuth } from "../../../helpers/AuthContext";
import DeleteIcon from "../../../assets/DeleteIcon";
import Pagination from "../../Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const itemsPerPageOptions = [5, 10, 15, 20];

  const indexOfLastProject = Math.min(
    currentPage * itemsPerPage,
    siteProjects.length
  );
  const indexOfFirstProject = (currentPage - 1) * itemsPerPage;
  const currentProjects = siteProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

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
        <span className="text-primary text-lg">No projects found</span>
      ) : (
        <Fragment>
          <div className=" flex flex-col items-center pb-0">
            <input
              type="text"
              placeholder="Search"
              className="p-2 w-[300px] mr-auto border-2 border-gray-200 rounded-lg mb-2"
            />
            <div className="flex flex-row mr-auto gap-2 text-primary mb-3">
              <Fragment>
                {indexOfFirstProject + 1} - {indexOfLastProject} /{" "}
                {siteProjects.length} Results
              </Fragment>
              <span>|</span>
              <span>
                Display
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className=""
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} results
                    </option>
                  ))}
                </select>
              </span>
            </div>
          </div>
          <span className="h-[1px] rounded-xl bg-[#d3d7df] w-full"></span>{" "}
          {/*line*/}
          <div className="flex flex-col pt-0 h-full">
            <div
              id="options"
              className="grid grid-cols-4 w-full text-primary items-center font-bold"
            >
              <button className="p-2">NAME</button>
              <button className="p-2">DEVICES</button>
              <button className="p-2">MEMBERS</button>
              <label className="text-center">ACTION</label>
            </div>

            {currentProjects.map((project: any) => (
              <Fragment key={project.projectId}>
                <span className="h-[0.75px] rounded-xl w-full bg-gray-200"></span>
                <div className="grid grid-cols-4 w-full items-center hover:cursor-pointer">
                  <label
                    className="text-center hover:cursor-pointer"
                    onClick={() => handleProjectClick(project.projectId)}
                  >
                    {project.projectName}
                  </label>
                  <label
                    className="text-center hover:cursor-pointer"
                    onClick={() => handleProjectClick(project.projectId)}
                  >
                    {project.deviceCount || project.devices?.length || 0}
                  </label>
                  <label
                    className="text-center hover:cursor-pointer"
                    onClick={() => handleProjectClick(project.projectId)}
                  >
                    {project.memberCount || project.members?.length}
                  </label>
                  <button
                    className="p-2 bg-transparent text-white rounded-lg flex items-center justify-center hover:cursor-pointer"
                    onClick={() => {
                      toggleDeleteProjectMenu(true, project._id);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </Fragment>
            ))}

            <span className="h-[0.75px] rounded-xl w-full bg-gray-200"></span>
            <div
              id="pagination"
              className="flex flex-row mt-auto ml-auto items-center"
            >
              <span className="mr-5 text-primary"></span>
              <Pagination
                totalItems={siteProjects.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};
export default ProjectsContainer;
