/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

const ChangeNameField = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/user/change-name", { name });
      setSuccess(response.data.message);
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="name" className="text-secondary font-bold text-xl mb-2">
          New Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChange}
          className="w-[300px] p-3 rounded-lg mb-3 text-primary border-[2px] border-solid border-[#d2d1d1]"
        />
      </div>
      <button
        type="submit"
        className="p-3 bg-primary text-white rounded-xl w-[300px] font-bold"
      >
        Change Name
      </button>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </form>
  );
};

export default ChangeNameField;
