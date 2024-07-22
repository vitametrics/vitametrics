/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../helpers/AuthContext";
import { DashboardNavbar } from "../components/Navigation/DashboardNavbar";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateProjectMenu from "../components/Menus/CreateProjectMenu";
import DeleteProjectMenu from "../components/Menus/DeleteProjectMenu";
import useDebounce from "../helpers/useDebounce";
import axios from "axios";
import { deleteProjectService } from "../services/projectService";
import ProjectsList from "../components/Lists/ProjectsList";

const CREATE_PROJECT_ENDPOINT = `${process.env.API_URL}/admin/create-project`;

const UserDashboard = () => {
  const { projects, setProjects, userRole, fetchUserProjects } = useAuth();
  const navigate = useNavigate();
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
  const [msg, setMsg] = useState("");
  const role =
    userRole === "siteOwner"
      ? "Owner"
      : userRole === "siteAdmin"
        ? "Admin"
        : userRole === "user"
          ? "User"
          : "Participant";

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

      const project = response.data.project;
      handleClose();
      await fetchUserProjects();
      navigate(`/dashboard/project?id=${project.projectId}&view=overview`);
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
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setShowBackDrop(false);
    toggleCreateProjectMenu(false);
    toggleDeleteProjectMenu(false);
    setProjectIdToDelete("");
    setMsg("");
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
    <div className="h-full bg-lightmodePrimary font-neueHassUnica">
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
        <h1 className="text-4xl mb-5 font-bold text-primary">
          Welcome back, {role}
        </h1>

        <div className="flex flex-col bg-white rounded-xl shadow-lg p-10 border-2 border-gray-300">
          <span className="text-left text-primary text-2xl mr-auto mb-3 font-bold">
            Projects
          </span>
          {userRole !== "user" && (
            <button
              onClick={() => toggleCreateProjectMenu(true)}
              className="p-2 bg-primary text-white rounded mb-5 text-xl w-[150px] mr-auto font-bold hover:bg-hoverPrimary"
            >
              New Project
            </button>
          )}
          {projects && projects.length === 0 ? (
            <Fragment>
              <span className="h-[1px] rounded-xl bg-[#d3d7df] w-full"></span>{" "}
              <span className="text-primary text-xl mt-2">
                No projects found
              </span>
            </Fragment>
          ) : (
            <ProjectsList
              projects={projects}
              handleProjectClick={handleProjectClick}
              toggleDeleteProjectMenu={toggleDeleteProjectMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
