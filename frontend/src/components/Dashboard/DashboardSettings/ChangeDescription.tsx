/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useProject } from "../../../helpers/ProjectContext";

const ChangeDescriptionField = () => {
  const MAX_CHARS = 500; // Set the maximum number of characters for the description
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const { projectDescription, setProjectDescription, projectId } = useProject();
  const [charsLeft, setCharsLeft] = useState(
    MAX_CHARS - projectDescription.length
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const CHANGE_DESC_ENDPOINT = `${import.meta.env.VITE_API_URL}/admin/change-project-description`;

    try {
      await axios.post(
        CHANGE_DESC_ENDPOINT,
        { projectId: projectId, newProjectDescription: projectDescription },
        { withCredentials: true }
      );
      setMessage("Project description changed successfully");
      setError(false);
    } catch (error: any) {
      setError(true);
      setMessage("Error changing description");
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= MAX_CHARS) {
      setProjectDescription(e.target.value);
      setCharsLeft(MAX_CHARS - e.target.value.length);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="desc" className="text-secondary font-bold text-xl mb-2">
          New Description
        </label>
        <p className={`${error ? "text-red-500" : "text-green-500"} text-lg `}>
          {" "}
          {message}
        </p>
        <textarea
          id="desc"
          value={projectDescription}
          onChange={handleDescriptionChange}
          maxLength={MAX_CHARS}
          className="w-[500px] p-3 rounded-lg mb-3 text-primary border-[2px] border-solid border-[#d2d1d1]"
        />
        <div className="text-sm mb-2 text-secondary">
          {charsLeft} characters left
        </div>
      </div>
      <button
        type="submit"
        className="p-3 bg-primary text-white rounded-xl w-[300px] font-bold"
      >
        Change Description
      </button>
    </form>
  );
};

export default ChangeDescriptionField;