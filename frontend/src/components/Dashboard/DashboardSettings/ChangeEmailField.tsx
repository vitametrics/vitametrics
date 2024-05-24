/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useProject } from "../../../helpers/ProjectContext";
import useDebounce from "../../../helpers/useDebounce";
const ChangeEmailField = () => {
  const MAX_CHARS = 500; // Set the maximum number of characters for the description
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const { project } = useProject();
  const [changeEmailInput, setChangeEmailInput] = useState("");
  const debouncedChangeEmailInput = useDebounce(changeEmailInput, 100);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const CHANGE_EMAIL_ENDPOINT = `${process.env.API_URL}/admin/change-project-email`;
    if (!debouncedChangeEmailInput) {
      setError(true);
      setMessage("Please enter a new email");
      return;
    }
    if (!isValidEmail(debouncedChangeEmailInput)) {
      setError(true);
      setMessage("Please enter a valid email address");
      return;
    }

    if (debouncedChangeEmailInput === project.ownerEmail) {
      setError(true);
      setMessage("New email is the same as the current email");
      return;
    }

    try {
      await axios.post(
        CHANGE_EMAIL_ENDPOINT,
        {
          projectId: project.projectId,
          newOwnerEmail: debouncedChangeEmailInput,
        },
        { withCredentials: true }
      );
      project.ownerEmail = debouncedChangeEmailInput;
      setMessage("Owner email changed successfully");
      setError(false);
    } catch (error: any) {
      setError(true);
      setMessage("Error changing email");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="desc" className="text-secondary font-bold text-xl mb-2">
          New Owner Email
        </label>
        <div className="text-sm mb-2 text-secondary">
          Current Email: {project.ownerEmail}
        </div>
        <p className={`${error ? "text-red-500" : "text-green-500"} text-lg `}>
          {message}
        </p>
        <input
          id="desc"
          value={changeEmailInput}
          onChange={(e) => setChangeEmailInput(e.target.value)}
          maxLength={MAX_CHARS}
          className="w-[500px] p-3 rounded-lg mb-3 text-primary border-[2px] border-solid border-[#d2d1d1]"
        />
      </div>
      <button
        type="submit"
        className="p-3 bg-primary text-white rounded-xl w-[300px] font-bold hover:bg-hoverPrimary shadow-lg"
      >
        Change Owner Email
      </button>
    </form>
  );
};

export default ChangeEmailField;
