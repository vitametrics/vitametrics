import ConnectIcon from "../../assets/ConnectIcon";
import FiftyPercentIcon from "../../assets/FiftyPercentIcon";
import { useOrg } from "../../helpers/OrgContext";
import axios from "axios";

const Devices = () => {
  const { devices, orgName } = useOrg();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const FETCH_DEVICES_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_DEVICES_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_DEVICES_DEV_ENDPOINT;

  const handleFetchDevices = async () => {
    try {
      const response = await axios.post(FETCH_DEVICES_ENDPOINT, {
        withCredentials: true,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-10 ">
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0">
        {orgName} Devices
      </h2>
      <div className="flex p-5 w-full">
        <button
          onClick={handleFetchDevices}
          className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[150px] bg-[#AE6B69] text-white"
        >
          <ConnectIcon />
          Fetch
        </button>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {devices.length > 0 ? (
          devices.map(
            (
              device: {
                device_id: string;
                device_type: string;
                last_sync_date: string;
                battery_level: number;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className="flex flex-row items-center gap-5 w-full h-[70px] bg-[#2E2E2E] rounded-xl p-5"
                >
                  <p className="text-2xl font-bold text-white mr-auto ">
                    {device.device_type || ""}
                  </p>
                  <h2 className="text-2xl font-bold text-white align flex items-center mr-3">
                    ID: {device.device_id || ""}
                  </h2>
                  <h2 className="text-2xl font-bold text-white align flex items-center">
                    Synced: {formatDate(device.last_sync_date) || ""}
                  </h2>
                  <p className="text-2xl font-bold text-white ml-auto flex flex-row gap-3">
                    {device.battery_level || ""}
                    <FiftyPercentIcon />
                  </p>
                </div>
              );
            }
          )
        ) : (
          <h2 className="text-2xl font-bold text-white">No Devices Found.</h2>
        )}
      </div>
    </div>
  );
};

export default Devices;
