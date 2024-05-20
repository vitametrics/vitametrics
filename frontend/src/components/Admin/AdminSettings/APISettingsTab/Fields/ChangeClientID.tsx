import useDebounce from "../../../../../helpers/useDebounce";
import { useState } from "react";

const ChangeClientID = () => {
  const [newClientId, setNewClientId] = useState("");
  const debouncedClientId = useDebounce(newClientId, 1000);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangeBaseUrl = () => {
    if (debouncedClientId) {
      setMessage("Valid URL");
      setError(false);
    } else {
      setError(true);
      setMessage("Invalid URL. Please ensure it starts with https://");
      console.error("Invalid URL. Please ensure it starts with https://");
    }
  };

  return (
    <div className="p-5 flex flex-col">
      <span className="bg-primary text-white font-bold text-xl mb-3 ">
        Change the current FitBit Client ID of the instance
      </span>
      <span className="bg-primary text-[#f5f5f5] pb-0 text-sm  mb-3">
        Current FitBit Client ID: {process.env.FITBIT_CLIENT_ID}
      </span>

      <span className="bg-primary text-secondary pb-0 text-md font-bold">
        Enter New FitBit Client ID
      </span>
      {error ? (
        <span className="bg-primary text-red-500 pb-0 text-sm font-bold">
          {message}
        </span>
      ) : (
        <span className="bg-primary text-green-500 pb-0 text-sm font-bold">
          {message}
        </span>
      )}
      <input
        type="text"
        value={newClientId}
        onChange={(e) => setNewClientId(e.target.value)}
        className="p-2 w-[300px] border-2 border-gray-200 rounded-lg mb-2"
      />
      <button
        className="bg-secondary text-white p-2 w-[200px] rounded-lg font-bold"
        onClick={handleChangeBaseUrl}
      >
        Change Client ID
      </button>
    </div>
  );
};

export default ChangeClientID;
