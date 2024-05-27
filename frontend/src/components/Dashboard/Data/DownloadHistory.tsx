import { useProject } from "../../../helpers/ProjectContext";
import { Fragment } from "react";
const DownloadHistory = () => {
  const { downloadHistory } = useProject();

  return (
    <div className="w-full h-[400px bg-white shadow-lg rounded-xl flex flex-col mb-10 p-10">
      <h1 className="text-left w-full text-2xl font-bold text-primary mb-3">
        Download History
      </h1>
      {downloadHistory.length === 0 ? (
        <p className="text-primary">No download history</p>
      ) : (
        <Fragment>
          {downloadHistory.map((item) => (
            <div className="flex flex-row justify-between w-full mb-3">
              <div className="flex flex-col">
                <h1 className="text-primary font-bold">{item.deviceId}</h1>
                <p className="text-secondary2">{item.createdAt}</p>
              </div>
              <button
                className="p-2 bg-primary text-white font-bold rounded-xl hover:bg-hoverPrimary"
                onClick={item.downloadUrl}
              >
                Download
              </button>
            </div>
          ))}
        </Fragment>
      )}
    </div>
  );
};
export default DownloadHistory;
