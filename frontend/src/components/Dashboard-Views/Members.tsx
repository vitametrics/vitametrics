import { useOrg } from "../../helpers/OrgContext";

const Members = () => {
  const { orgName, members } = useOrg();

  /*
  const [members, setMembers] = useState([
    {
      name: "Brandon Le",
      email: "bro",
    },
    {
      name: "Sean Cornell",
      email: "bro",
    },
    {
      name: "Angel Vasquez",
      email: "bro",
    },
  ]);
*/

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
          members.map((member: { email: string }, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center h-[70px] justify-center hover:cursor-pointer  bg-[#93C7E1] dark:bg-[#2E2E2E] rounded-xl p-5"
              >
                <p className="text-xl text-white dark:text-white text-center">
                  {member.email}
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
