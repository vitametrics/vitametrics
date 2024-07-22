/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from "react";
import DeleteIcon from "../../assets/DeleteIcon";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";

interface ProjectsListProps {
  projects: any[];
  handleProjectClick: (projectId: string) => void;
  toggleDeleteProjectMenu: (show: boolean, projectId: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  handleProjectClick,
  toggleDeleteProjectMenu,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const itemsPerPageOptions = [5, 10, 15, 20];

  const indexOfLastProject = Math.min(
    currentPage * itemsPerPage,
    projects.length
  );
  const indexOfFirstProject = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(
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
    <Fragment>
      <div className=" flex flex-col items-center pb-0">
        <input
          type="text"
          placeholder="Search"
          className="p-2 w-[300px] mr-auto border-2 border-gray-200 rounded-lg mb-2"
        />
        <div className="flex flex-row mr-auto gap-2 text-primary mb-3">
          <Fragment>
            {indexOfFirstProject + 1} - {indexOfLastProject} / {projects.length}{" "}
            Results
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
          totalItems={projects.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </Fragment>
  );
};

export default ProjectsList;
