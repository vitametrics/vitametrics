/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useProject } from "../../../helpers/ProjectContext";

const ChangeNameField = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { projectId, project, updateProject } = useProject();
  const MAX_CHARS = 100;
  const [charsLeft, setCharsLeft] = useState(MAX_CHARS - name.length);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setName(e.target.value);
      setCharsLeft(MAX_CHARS - e.target.value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const CHANGE_NAME_ENDPOINT = `${process.env.API_URL}/admin/change-project-name`;

    if (!name) {
      setError(true);
      setMessage("Please enter a new project name");
      return;
    }

    if (name === project.projectName) {
      setError(true);
      setMessage("New name is the same as the current name");
      return;
    }

    try {
      await axios.post(
        CHANGE_NAME_ENDPOINT,
        { newProjectName: name, projectId: projectId },
        { withCredentials: true }
      );
      updateProject({ projectName: name });
      setMessage("Project name changed successfully");
      setError(false);
    } catch (error: any) {
      setMessage("Error changing name");
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="desc" className="text-primary font-bold text-lg mb-1">
          New Project Name
        </label>
        <div className="text-sm mb-1 text-secondary">
          Current Name: {project.projectName}
        </div>
        <p className={`${error ? "text-red-500" : "text-green-500"} text-md `}>
          {message}
        </p>
        <input
          id="desc"
          value={name}
          onChange={handleNameChange}
          maxLength={MAX_CHARS}
          className="w-[500px] p-2 rounded-lg mb-3 text-primary border-[2px] border-solid border-[#d2d1d1]"
        />
      </div>
      <div className="text-sm mb-1 text-secondary">
        {charsLeft} characters left
      </div>
      <button
        type="submit"
        className="p-2 bg-primary text-white text-md rounded w-[250px] font-bold hover:bg-hoverPrimary shadow-lg"
      >
        Change Project Name
      </button>
    </form>
  );
};

export default ChangeNameField;
