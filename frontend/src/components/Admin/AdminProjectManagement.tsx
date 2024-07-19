/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../../helpers/AuthContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import ProjectsContainer from "./AdminProjects/ProjectsContainer";
import axios from "axios";
import { useState } from "react";
import useDebounce from "../../helpers/useDebounce";
import { useSearchParams } from "react-router-dom";
import CreateProjectMenu from "../Dashboard/CreateProjectMenu";
import DeleteProjectMenu from "../Dashboard/DeleteProjectMenu";
import { deleteProjectService } from "../../services/projectService";
import ProjectsInfo from "./AdminProjects/ProjectsInfo";

const CREATE_PROJECT_ENDPOINT = `${process.env.API_URL}/admin/create-project`;

const AdminProjectManagement = () => {
  const { fetchInstanceProjects, projects, setProjects, setShowBackDrop } =
    useAuth();
  const { ref, inView } = useCustomInView();

  useEffect(() => {
    fetchInstanceProjects();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams({
    createProject: "false",
    deleteProject: "false",
    project: "",
  });

  const [projectName, setProjectName] = useState("");
  const debouncedProjectName = useDebounce(projectName, 100);
  const [projectDescription, setProjectDescription] = useState("");
  const debouncedProjectDescription = useDebounce(projectDescription, 100);
  const [projectIdToDelete, setProjectIdToDelete] = useState<string>("");
  const [msg, setMsg] = useState("");

  const projectId = searchParams.get("project") || "";
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
    setSearchParams((prev) => {
      prev.set("project", projectId);
      return prev;
    });
    setShowBackDrop(true);
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
      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);
      console.log(project);
      toggleCreateProjectMenu(false);
      setMsg("");
      setProjectName("");
      setProjectDescription("");
      fetchInstanceProjects();
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

  const handleClose = () => {
    setSearchParams((prev) => {
      prev.delete("createProject");
      prev.delete("deleteProject");
      prev.delete("project");
      return prev;
    });
    setMsg("");
    setShowBackDrop(false);
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
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-neueHassUnica"
    >
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
      <ProjectsInfo
        setProjectIdToDelete={setProjectIdToDelete}
        projectId={projectId}
        handleDeleteProject={handleDeleteProject}
        handleClose={handleClose}
      />
      <ProjectsContainer
        toggleCreateProjectMenu={toggleCreateProjectMenu}
        toggleDeleteProjectMenu={toggleDeleteProjectMenu}
        handleProjectClick={handleProjectClick}
      />
    </motion.div>
  );
};

export default AdminProjectManagement;
