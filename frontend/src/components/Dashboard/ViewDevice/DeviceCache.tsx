import { useProject } from "../../../helpers/ProjectContext";

interface DeviceCacheProps {
  deviceId: string;
}

const DeviceCache: React.FC<DeviceCacheProps> = ({ deviceId }) => {
  const { downloadHistory } = useProject();

  const deviceCache = downloadHistory.filter(
    (download) => download.deviceId === deviceId
  );

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold">Device Cache</h1>
      {deviceCache.length === 0 ? (
        <div className="flex flex-row mt-5">
          <span className="text-primary text-lg">No files downloaded yet</span>
        </div>
      ) : (
        <div className="flex flex-col">
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
                <span className="w-1/3 text-primary underline">Delete</span>
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
