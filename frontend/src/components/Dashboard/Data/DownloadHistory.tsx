const DownloadHistory = () => {
  const download_history = [
    {
      fileName: "file1",
      date: "10/10/2021",
    },
    {
      fileName: "file2",
      date: "10/10/2021",
    },
    {
      fileName: "file3",
      date: "10/10/2021",
    },
    {
      fileName: "file4",
      date: "10/10/2021",
    },
  ];

  return (
    <div className="w-full h-[400px bg-white shadow-lg rounded-xl flex flex-col mb-10 p-10">
      <h1 className="text-left w-full text-2xl font-bold text-primary mb-3">
        Download History
      </h1>
      {download_history.map((item) => (
        <div className="flex flex-row justify-between w-full mb-3">
          <div className="flex flex-col">
            <h1 className="text-primary font-bold">{item.fileName}</h1>
            <p className="text-secondary2">{item.date}</p>
          </div>
          <button className="p-2 bg-primary text-white font-bold rounded-xl hover:bg-hoverPrimary">
            Download
          </button>
        </div>
      ))}
    </div>
  );
};
export default DownloadHistory;
