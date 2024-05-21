import { useState } from "react";

const ChangeClientSecret = () => {
  const [showSecret, setShowSecret] = useState(false); // State to toggle visibility

  /*
  const [newClientSecret, setNewClientSecret] = useState("");
  const debouncedClientId = useDebounce(newClientSecret, 1000);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangeClientSecret = () => {
    if (debouncedClientId) {
      setMessage("Client Secret has been updated.");
      setError(false);
    } else {
      setError(true);
      setMessage("Invalid input. Please try again.");
      console.error("Invalid input. Please try again.");
    }
  };
  */
  const displayPartialSecret = (secret: string) => {
    const visibleLength = 4; // Number of characters to show
    if (secret.length > visibleLength) {
      return `${secret.substring(0, visibleLength)}${"*".repeat(secret.length - visibleLength)}`;
    }
    return secret; // In case the secret is shorter than the visible length
  };

  return (
    <div className="p-5 flex flex-col">
      <span className="bg-primary text-white font-bold text-xl mb-3">
        Current FitBit Client Secret of the instance
      </span>
      <span className="bg-primary text-[#f5f5f5] pb-0 text-sm mb-3">
        Current FitBit Client Secret:{" "}
        {showSecret
          ? process.env.FITBIT_CLIENT_SECRET
          : displayPartialSecret(process.env.FITBIT_CLIENT_SECRET as string)}
        <button
          onClick={() => setShowSecret(!showSecret)}
          className="bg-primary text-lightPrimary p-2 italic "
        >
          {showSecret ? "Hide" : "Show"}
        </button>
      </span>
      {/*
      <span className="bg-primary text-secondary pb-0 text-md font-bold">
        Enter New FitBit Client Secret
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
        type={showSecret ? "text" : "password"}
        value={newClientSecret}
        onChange={(e) => setNewClientSecret(e.target.value)}
        className="p-2 w-[300px] border-2 border-gray-200 rounded-lg mb-2"
      />

      <button
        className="bg-secondary text-white p-2 w-[200px] rounded-lg font-bold"
        onClick={handleChangeClientSecret}
      >
        Change Client Secret
    </button>*/}
    </div>
  );
};

export default ChangeClientSecret;
