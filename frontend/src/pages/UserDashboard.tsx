/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../helpers/AuthContext";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import CreateProjectMenu from "../components/Dashboard/CreateProjectMenu";
import DeleteProjectMenu from "../components/Dashboard/DeleteProjectMenu";
import useDebounce from "../helpers/useDebounce";
import axios from "axios";
import { deleteProjectService } from "../services/projectService";
import DeleteIcon from "../assets/DeleteIcon";
import { Project } from "../types/Project";

const CREATE_PROJECT_ENDPOINT = `${process.env.API_URL}/admin/create-project`;

const UserDashboard = () => {
  const { projects, setProjects, userRole, fetchInstanceProjects } = useAuth();
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
  const [msg, setMsg] = useState("");
  const role =
    userRole === "siteOwner"
      ? "Owner"
      : userRole === "siteAdmin"
        ? "Admin"
        : userRole === "user"
          ? "User"
          : "Participant";

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
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
    setMsg("");
    setShowBackDrop(show);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/project?id=${projectId}&view=overview`);
  };

  const getErrorMessage = (error: any) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      switch (status) {
        case 401:
          return "You are not authorized to create projects. Please login.";
        case 409:
          return "A project with the same name already exists.";
        default:
          return "Failed to create project. Please try again later.";
      }
    } else {
      return "An unexpected error occurred.";
    }
  };

  const handleCreateProject = async () => {
    if (!debouncedProjectName) {
      setMsg("Project name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        CREATE_PROJECT_ENDPOINT,
        {
          projectName: debouncedProjectName,
          projectDescription: debouncedProjectDescription,
        },
        { withCredentials: true }
      );

      const project = response.data.savedProject;
      console.log("project that was created");
      console.log(project);
      //try this fix!
      await fetchInstanceProjects();
      console.log("current projects");
      console.log(projects);

      navigate(`/dashboard/project?id=${project.projectId}&view=overview`);
      setMsg("");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setMsg(errorMessage);
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
    <div className="h-full bg-lightmodePrimary font-ralewayBold">
      <DashboardNavbar />
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>

      <CreateProjectMenu
        show={createProject}
        msg={msg}
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
          Welcome back, {role}
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
                    {project.devices?.length || 0}
                  </label>
                  <label
                    className="text-center hover:cursor-pointer"
                    onClick={() => handleProjectClick(project.projectId)}
                  >
                    {project.members?.length || 1}
                  </label>
                  <button
                    className="p-2 bg-transparent text-white rounded-lg flex items-center justify-center hover:cursor-pointer"
                    onClick={() =>
                      toggleDeleteProjectMenu(true, project.projectId)
                    }
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
