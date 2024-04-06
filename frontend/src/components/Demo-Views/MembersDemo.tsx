const MembersDemo = () => {
  const orgname = "Ada Lovelace's Org";
  const members = [
    {
      name: "Brandon Le",
      email: "brandonle831@gmail.com",
    },
    {
      name: "Sean Cornell",
      email: "seancornell@gmail.com",
    },
    {
      name: "Angel Vazquez",
      email: "angelvazquez@gmail.com",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-10  ">
      <h2 className="w-full text-4xl font-ralewayBold text-white p-5 pb-0">
        {orgname} Members
      </h2>
      <div className="flex p-5 w-full">
        <button className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[230px] bg-[#AE6B69] text-white">
          Invite
        </button>
      </div>
      <div className="flex flex-row flex-wrap gap-5 p-5">
        {members.length > 0 ? (
          members.map((member: { email: string }, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center h-[70px] justify-center hover:cursor-pointer  bg-[#2E2E2E] rounded-xl p-5"
              >
                <p className="text-xl text-white text-center">{member.email}</p>
              </div>
            );
          })
        ) : (
          <h2 className="text-2xl font-bold text-white">No Members Found.</h2>
        )}
      </div>
    </div>
  );
};

export default MembersDemo;
