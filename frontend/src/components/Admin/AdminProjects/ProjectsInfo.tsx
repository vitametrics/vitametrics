/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, Fragment, useEffect } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";
import { ProjectInfoProps, Project } from "../../../types/Project";
import EditButton from "../../Buttons/EditButton";
import CancelButton from "../../Buttons/CancelButton";
import SaveButton from "../../Buttons/SaveButton";
import axios from "axios";
import { useAuth } from "../../../helpers/AuthContext";

type EditableFields = "projectName" | "projectDescription" | "role";

const ProjectsInfo: React.FC<ProjectInfoProps> = ({
  setProjectIdToDelete,
  projectId,
  handleDeleteProject,
  handleClose,
}) => {
  const { ref, inView } = useCustomInView();
  const [confirmDelete, setConfirmDelete] = useState({
    id: "",
    confirm: false,
  });
  const [editMode, setEditMode] = useState<{
    [key in EditableFields]: boolean;
  }>({
    projectName: false,
    projectDescription: false,
    role: false,
  });

  const deleteProject = async (id: string) => {
    if (confirmDelete.confirm && confirmDelete.id === id) {
      await handleDeleteProject();
      setProjectIdToDelete("");
      setConfirmDelete({ id, confirm: false });
    } else {
      setProjectIdToDelete(id);
      setConfirmDelete({ id, confirm: true });
    }
  };

  const { siteProjects, setSiteProjects } = useAuth();
  const siteProject = siteProjects.find(
    (project: Project) => project.projectId === projectId
  );
  const [msg, setMsg] = useState("");
  const [flag, setFlag] = useState(false);

  const [editedProject, setEditedProject] = useState({
    projectName: siteProject?.projectName || "",
    projectDescription: siteProject?.projectDescription || "",
    ownerId: siteProject?.ownerId || "",
  });

  const shortenDescription = (description: string) => {
    return description.length > 100
      ? description.slice(0, 100) + "..."
      : description;
  };

  useEffect(() => {
    const siteProject = siteProjects.find(
      (m: Project) => m.projectId === projectId
    );
    if (siteProject) {
      setEditedProject({
        projectName: siteProject.projectName,
        projectDescription: siteProject.projectDescription,
        ownerId: siteProject.ownerId,
      });
    }
  }, [siteProjects, projectId]);

  if (!projectId) return null;

  const handleEditChange = (field: EditableFields, value: string) => {
    setEditedProject((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = (field: EditableFields) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleEdits = async (type: EditableFields) => {
    toggleEditMode(type);

    try {
      const response = await axios.put(
        `${process.env.API_URL}/owner/project/${siteProject?._id}`,
        {
          projectName: editedProject.projectName,
          projectDescription: editedProject.projectDescription,
          ownerId: editedProject.ownerId,
        },
        { withCredentials: true }
      );
      console.log(response);
      const updatedProject = response.data;
      const updatedProjects = siteProjects.map((project: Project) =>
        project.projectId === updatedProject.projectId
          ? updatedProject
          : project
      );

      setFlag(true);
      console.log(updatedProjects);
      setSiteProjects(updatedProjects);
      setEditedProject(updatedProject);
      setMsg("Project info updated");
    } catch (error) {
      setFlag(false);
      setMsg("Error updating project info");
      console.log(error);
    }
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="absolute w-full h-[500px] p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[500px] md:w-[500px] rounded-xl text-primary"
    >
      <button
        onClick={() => {
          handleClose(), setMsg("");
        }}
        className="ml-auto item-3"
      ></button>
      <h1 className="text-2xl text-center font-bold text-primary">
        Project Info
      </h1>
      {flag ? (
        <p className="text-green-500"> {msg}</p>
      ) : (
        <p className="text-red-500"> {msg} </p>
      )}

      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">Name:</strong>
        {editMode.projectName ? (
          <input
            type="text"
            value={editedProject.projectName}
            onChange={(e) => handleEditChange("projectName", e.target.value)}
            className="flex-1 px-2 rounded"
          />
        ) : (
          siteProject?.projectName
        )}
        <Fragment>
          {editMode.projectName ? (
            <Fragment>
              <SaveButton onClick={() => handleEdits("projectName")} />
              <CancelButton onClick={() => toggleEditMode("projectName")} />
            </Fragment>
          ) : (
            <EditButton onClick={() => toggleEditMode("projectName")} />
          )}
        </Fragment>
      </div>
      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">PID:</strong>
        {projectId}
      </div>
      <div className="text-xl mb-1 text-left flex flex-col">
        <strong className="mr-2">Description:</strong>
        {editMode.projectDescription ? (
          <textarea
            value={editedProject.projectDescription}
            onChange={(e) =>
              handleEditChange("projectDescription", e.target.value)
            }
            className="flex-1 px-2 rounded"
          />
        ) : (
          shortenDescription(siteProject?.projectDescription ?? "")
        )}
        <Fragment>
          {editMode.projectDescription ? (
            <div className="flex flex-row mt-5 gap-2">
              <button
                className="bg-primary text-white p-1 rounded hover:bg-hoverPrimary w-[100px]"
                onClick={() => handleEdits("projectDescription")}
              >
                Save
              </button>
              <button
                className="bg-secondary text-white p-1 rounded hover:bg-secondary2 w-[100px]"
                onClick={() => toggleEditMode("projectDescription")}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-secondary text-white p-1 rounded hover:bg-secondary2 w-[100px] mt-3"
              onClick={() => toggleEditMode("projectDescription")}
            >
              Edit
            </button>
          )}
        </Fragment>
      </div>

      <button
        onClick={() => {
          deleteProject(siteProject._id);
        }}
        className={`w-full mt-auto ${confirmDelete.id === siteProject._id ? "bg-yellow-500" : "bg-red-500"} text-white p-3 rounded`}
      >
        {confirmDelete.id === siteProject._id
          ? "Confirm Delete Project"
          : "Delete Project"}
      </button>
    </motion.div>
  );
};

export default ProjectsInfo;
