const ChangeBaseURL = () => {
  //const [newBaseUrl, setNewBaseUrl] = useState("https://");
  //const debouncedChangeBaseUrl = useDebounce(newBaseUrl, 1000);
  //const [error, setError] = useState(false);
  //const [message, setMessage] = useState("");

  /*
  const isValidHttpsUrl = (url: string) => {
    const regex = /^https:\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return regex.test(url);
  };*/

  {
    /*
  const handleChangeBaseUrl = () => {
    if (isValidHttpsUrl(debouncedChangeBaseUrl)) {
      setMessage("Valid URL");
      setError(false);
    } else {
      setError(true);
      setMessage("Invalid URL. Please ensure it starts with https://");
      console.error("Invalid URL. Please ensure it starts with https://");
    }
  };*/
  }

  return (
    <div className="p-5 flex flex-col">
      <span className="bg-primary text-white font-bold text-xl mb-3 ">
        Current base URL of the instance
      </span>
      <span className="bg-primary text-[#f5f5f5] pb-0 text-sm  mb-3">
        Current Base URL: {process.env.BASE_URL}
      </span>
      {/*

      <span className="bg-primary text-secondary pb-0 text-md font-bold">
        Enter New Base URL
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
        value={newBaseUrl}
        onChange={(e) => setNewBaseUrl(e.target.value)}
        className="p-2 w-[300px] border-2 border-gray-200 rounded-lg mb-2"
      />
      <button
        className="bg-secondary text-white p-2 w-[200px] rounded-lg font-bold"
        onClick={handleChangeBaseUrl}
      >
        Change Base URL
    </button>*/}
    </div>
  );
};

export default ChangeBaseURL;
