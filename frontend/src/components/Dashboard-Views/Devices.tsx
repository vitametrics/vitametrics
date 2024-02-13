import axios from "axios";
import { useState, useEffect } from "react";
import ConnectIcon from "../../assets/ConnectIcon";
import FiftyPercentIcon from "../../assets/FiftyPercentIcon";

const Devices = () => {
  const orgId = sessionStorage.getItem("orgId");
  const [devices, setDevices] = useState([
    {
      owner: "Brandon Le",
      type: "Inspire 3",
      status: "50%",
    },
    {
      owner: "Sean Cornell",
      type: "Luxe",
      status: "50%",
    },
    {
      owner: "Angel Vasquez",
      type: "Charge 6",
      status: "50%",
    },
  ]);
  const [orgName, setOrgName] = useState("");

  const fetchOrg = async () => {
    try {
      const response = await axios.get("https://physiobit.org/api/user/org/info", {
        params: {
          orgId: orgId,
        },
	withCredentials: true,
      });

      console.log(response.data);
      setDevices(response.data.devices || devices);
      setOrgName(response.data.orgName);
    } catch (error) {
      console.log(error);
    }
  };

  //use effect to fetch org upon load
  useEffect(() => {
    fetchOrg();
  }, []); // Include 'fetchOrg' in the dependency array

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
          devices.map((device, index) => {
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
          })
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
