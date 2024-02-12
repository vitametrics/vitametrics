import { useState, useEffect } from "react";
import axios from "axios";

const Members = () => {
  const [orgName, setOrgName] = useState("");
  const orgId = sessionStorage.getItem("orgId");

  const [members, setMembers] = useState([
    {
      name: "Brandon Le",
    },
    {
      name: "Sean Cornell",
    },
    {
      name: "Angel Vasquez",
    },
  ]);

  const fetchOrg = async () => {
    try {
      const response = await axios.get("http://localhost:7970/user/org/info", {
        params: {
          orgId: orgId,
        },
      });

      console.log(response.data);
      //setDevices(response.data.devices || []);
      setMembers(response.data.members || []);
      setOrgName(response.data.orgName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-10 bg-[#FAF9F6] dark:bg-[#1E1D20] dark:bg-hero-texture">
      <h2 className="w-full text-4xl font-ralewayBold text-[#373F51] dark:text-white p-5 pb-0">
        {orgName} Members
      </h2>
      <div className="flex p-5 w-full">
        <button className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[230px] bg-[#93C7E1] dark:bg-[#AE6B69] text-white">
          Invite
        </button>
      </div>
      <div className="flex flex-row flex-wrap gap-5 p-5">
        {members.length > 0 ? (
          members.map((member, index) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center w-[200px] h-[70px] justify-center hover:cursor-pointer  bg-[#93C7E1] dark:bg-[#2E2E2E] rounded-xl p-5"
              >
                <p className="text-xl text-white dark:text-white text-center">
                  {member.name}
                </p>
              </div>
            );
          })
        ) : (
          <h2 className="text-2xl font-bold text-[#373F51] dark:text-white">
            No Members Found.
          </h2>
        )}
      </div>
    </div>
  );
};

export default Members;