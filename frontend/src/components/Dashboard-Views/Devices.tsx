import ConnectIcon from "../../assets/ConnectIcon";
import FiftyPercentIcon from "../../assets/FiftyPercentIcon";

interface DevicesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  devices: any[];
  orgName: string;
}

const Devices: React.FC<DevicesProps> = ({ devices, orgName }) => {
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_DEV_ENDPOINT; //~development;
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT;
  //const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT; //~development;
  //const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_ENDPOINT; //~ production

  return (
    <div className="w-full h-full flex flex-col p-10 bg-[#FAF9F6] dark:bg-[#1E1D20] dark:bg-hero-texture">
      <h2 className="w-full text-4xl font-ralewayBold text-[#373F51] dark:text-white p-5 pb-0">
        {orgName} Devices
      </h2>
      <div className="flex p-5 w-full">
        <button className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[230px] bg-[#93C7E1] dark:bg-[#AE6B69] text-white">
          <ConnectIcon />
          Connect
        </button>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {devices.length > 0 ? (
          devices.map(
            (
              device: { owner: string; type: string; status: string },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className="flex flex-row items-center  w-full h-[70px] bg-[#93C7E1] dark:bg-[#2E2E2E] rounded-xl p-5"
                >
                  <p className="text-2xl font-bold text-white mr-auto ">
                    {device.type || ""}
                  </p>
                  <h2 className="text-2xl font-bold text-white align flex items-center">
                    Owner: {device.owner || ""}
                  </h2>
                  <p className="text-2xl font-bold text-white ml-auto flex flex-row gap-3">
                    {device.status || ""}
                    <FiftyPercentIcon />
                  </p>
                </div>
              );
            }
          )
        ) : (
          <h2 className="text-2xl font-bold text-[#373F51] dark:text-white">
            No Devices Found.
          </h2>
        )}
      </div>
    </div>
  );
};

export default Devices;
