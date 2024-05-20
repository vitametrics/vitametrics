/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useProject } from "../../../helpers/ProjectContext";

const ChangeNameField = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { projectId, projectName, setProjectName } = useProject();
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
    const CHANGE_NAME_ENDPOINT = `${import.meta.env.VITE_API_URL}/admin/change-project-name`;

    try {
      await axios.post(
        CHANGE_NAME_ENDPOINT,
        { newProjectName: name, projectId: projectId },
        { withCredentials: true }
      );
      setProjectName(name);
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
        <label htmlFor="desc" className="text-secondary font-bold text-xl mb-2">
          New Project Name
        </label>
        <div className="text-sm mb-2 text-secondary">
          Current Name: {projectName}
        </div>
        <p className={`${error ? "text-red-500" : "text-green-500"} text-lg `}>
          {message}
        </p>
        <input
          id="desc"
          value={name}
          onChange={handleNameChange}
          maxLength={MAX_CHARS}
          className="w-[500px] p-3 rounded-lg mb-3 text-primary border-[2px] border-solid border-[#d2d1d1]"
        />
      </div>
      <div className="text-sm mb-2 text-secondary">
        {charsLeft} characters left
      </div>
      <button
        type="submit"
        className="p-3 bg-primary text-white rounded-xl w-[300px] font-bold"
      >
        Change Project Name
      </button>
    </form>
  );
};

export default ChangeNameField;
