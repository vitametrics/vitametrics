/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../helpers/AuthContext";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import CreateProjectMenu from "../components/Dashboard/CreateProjectMenu";
import DeleteProjectMenu from "../components/Dashboard/DeleteProjectMenu";
import useDebounce from "../helpers/useDebounce";
import {
  deleteProjectService,
  createProjectService,
} from "../services/projectService";

interface Project {
  projectId: string;
  projectName: string;
  deviceCount: number;
  memberCount: number;
}

const UserDashboard = () => {
  const { projects, setProjects, userRole } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    createProject: "false",
    deleteProject: "false",
  });
  const [projectName, setProjectName] = useState("");
  const debouncedProjectName = useDebounce(projectName, 100);
  const [projectDescription, setProjectDescription] = useState("");
  const debouncedProjectDescription = useDebounce(projectDescription, 100);
  const [projectIdToDelete, setProjectIdToDelete] = useState<string>("");
  const itemsPerPageOptions = [5, 10, 15, 20];

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page after changing the number of items per page
  };

  const indexOfLastProject = Math.min(
    currentPage * itemsPerPage,
    projects.length
  );
  const indexOfFirstProject = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const createProject = searchParams.get("createProject") === "true";
  const deleteProject = searchParams.get("deleteProject") === "true";

  useEffect(() => {
    if (createProject) setShowBackDrop(createProject);
  }, []);

  const toggleCreateProjectMenu = (show: boolean) => {
    setSearchParams((prev) => {
      prev.set("createProject", show.toString());
      return prev;
    });
    setShowBackDrop(show); // Show or hide backdrop when invite menu is toggled
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/project?id=${projectId}&view=overview`);
  };

  const handleCreateProject = async () => {
    try {
      const project = await createProjectService(
        debouncedProjectName,
        debouncedProjectDescription
      );

      console.log(project);

      toggleCreateProjectMenu(false);
      setProjectName("");
      setProjects([...projects, project]);
      handleProjectClick(project.projectId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectIdToDelete) return;

    try {
      await deleteProjectService(projectIdToDelete);
      setProjects(
        projects.filter((project) => project.projectId !== projectIdToDelete)
      );
      setProjectIdToDelete("");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDeleteProjectMenu = (show: boolean, projectId?: string) => {
    setSearchParams((prev) => {
      prev.set("deleteProject", show.toString());
      return prev;
    });
    setProjectIdToDelete(projectId || ""); // Save or clear the project ID
    setShowBackDrop(show);
  };

  return (
    <div className="h-screen bg-lightmodePrimary font-ralewayBold">
      <DashboardNavbar />
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>

      <CreateProjectMenu
        show={createProject}
        toggleMenu={toggleCreateProjectMenu}
        projectName={projectName}
        setProjectName={setProjectName}
        setProjectDescription={setProjectDescription}
        handleCreateProject={handleCreateProject}
      />

      <DeleteProjectMenu
        show={deleteProject}
        toggleMenu={toggleDeleteProjectMenu}
        handleDelete={handleDeleteProject}
      />
      <div className="p-20 bg-lightmodeSecondary h-full">
        <h1 className="text-4xl mb-5 font-libreFranklin font-bold text-primary">
          Welcome back
        </h1>

        <div className="flex flex-col bg-white rounded-xl shadow-lg font-libreFranklin p-10">
          <div className=" flex flex-col items-center pb-0">
            <span className="text-left text-primary text-2xl mr-auto mb-3 font-bold">
              Projects
            </span>
            {userRole !== "user" && (
              <button
                onClick={() => toggleCreateProjectMenu(true)}
                className="p-2 bg-primary text-white rounded-lg mb-5 text-xl w-[150px] mr-auto font-bold"
              >
                New Project
              </button>
            )}
            {/* search bar */}
            <input
              type="text"
              placeholder="Search"
              className="p-2 w-[300px] mr-auto border-2 border-gray-200 rounded-lg mb-2"
            />
            <div className="flex flex-row mr-auto gap-2 text-primary mb-3">
              <Fragment>
                {indexOfFirstProject + 1} - {indexOfLastProject} /{" "}
                {projects.length} Results
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

            {currentProjects.map((project: Project) => (
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
                    {project.deviceCount}
                  </label>
                  <label
                    className="text-center hover:cursor-pointer"
                    onClick={() => handleProjectClick(project.projectId)}
                  >
                    {project.memberCount}
                  </label>
                  <button
                    className="p-2 bg-transparent text-white rounded-lg flex items-center justify-center hover:cursor-pointer"
                    onClick={() =>
                      toggleDeleteProjectMenu(true, project.projectId)
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      width="35px"
                      height="35px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                          stroke="#464455"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
