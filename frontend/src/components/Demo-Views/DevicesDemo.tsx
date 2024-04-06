import ConnectIcon from "../../assets/ConnectIcon";
import FiftyPercentIcon from "../../assets/FiftyPercentIcon";

const DevicesDemo = () => {
  const orgName = "Ada Lovelace's Org";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const devices = [
    {
      id: "2570612980",
      deviceVersion: "Alta HR",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 100,
    },
    {
      id: "2570612417",
      deviceVersion: "Fitbit Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 10,
    },
    {
      id: "2570612980",
      deviceVersion: "Apple Vision Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      batteryLevel: 50,
    },
    {
      id: "4200612980",
      deviceVersion: "Playstation 5",
      lastSyncTime: "1995-04-24T00:02:43.000",
      batteryLevel: 25,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-10 ">
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0">
        {orgName} Devices
      </h2>
      <div className="flex p-5 w-full">
        <button className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[150px] bg-[#AE6B69] text-white">
          <ConnectIcon />
          Fetch
        </button>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {devices.length > 0 ? (
          devices.map(
            (
              device: {
                id: string;
                deviceVersion: string;
                lastSyncTime: string;
                batteryLevel: number;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className="flex flex-row items-center gap-5 w-full h-[70px] bg-[#2E2E2E] rounded-xl p-5"
                >
                  <p className="text-2xl font-bold text-white mr-auto ">
                    {device.deviceVersion || ""}
                  </p>
                  <h2 className="text-2xl font-bold text-white align flex items-center mr-3">
                    ID: {device.id || ""}
                  </h2>
                  <h2 className="text-2xl font-bold text-white align flex items-center">
                    Synced: {formatDate(device.lastSyncTime) || ""}
                  </h2>
                  <p className="text-2xl font-bold text-white ml-auto flex flex-row gap-3">
                    {device.batteryLevel || ""}
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

export default DevicesDemo;
