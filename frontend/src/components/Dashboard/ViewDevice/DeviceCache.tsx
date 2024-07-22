import { useProject } from "../../../helpers/ProjectContext";
import axios from "axios";

interface DeviceCacheProps {
  deviceId: string;
}

const CLEAR_CACHE_ENDPOINT = `${process.env.API_URL}/project/delete-cached-files`;

const DeviceCache: React.FC<DeviceCacheProps> = ({ deviceId }) => {
  const { downloadHistory, setDownloadHistory } = useProject();

  const deviceCache = downloadHistory.filter(
    (download) => download.deviceId === deviceId
  );

  const handleClearCache = async () => {
    try {
      await axios.post(
        CLEAR_CACHE_ENDPOINT,
        {
          deviceId: deviceId,
        },
        { withCredentials: true }
      );

      setDownloadHistory(
        downloadHistory.filter((download) => download.deviceId !== deviceId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="w-full text-2xl font-bold pb-0 text-primary my-3">
        Device Cache
      </h2>
      {deviceCache.length === 0 ? (
        <div className="flex flex-row mt-5">
          <span className="text-primary text-lg">No files downloaded yet</span>
        </div>
      ) : (
        <div className="flex flex-col">
          <button
            className="bg-red-400 p-2 w-[200px] text-white rounded hover:bg-red-300"
            onClick={() => handleClearCache()}
          >
            Clear Cache
          </button>
          <div className="grid grid-cols-3 text-primary font-bold my-2">
            <span>File Name</span>
            <span>Download Date</span>
            <span> Action</span>
          </div>
          {deviceCache.map((cache) => (
            <div className="hover:bg-slate-50 flex flex-col">
              <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
              <div
                className="grid grid-cols-3 hover:cursor-pointer items-center my-2"
                onClick={() => window.open(cache.downloadUrl)}
              >
                <span className="w-1/3">{cache.key}</span>
                <span className="w-1/3">{cache.createdAt}</span>
                <span
                  className="w-1/3 text-primary"
                  onClick={() => window.open(cache.downloadUrl)}
                >
                  Download
                </span>
              </div>
            </div>
          ))}
          <span className="h-[0.5px] bg-[#d3d7df] w-full "></span>
        </div>
      )}
    </div>
  );
};
export default DeviceCache;
