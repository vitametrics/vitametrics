import { Fragment } from "react";
import { MembersListProps } from "../../../types/Member";

const MembersList: React.FC<MembersListProps> = ({ members, onClick }) => {
  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-3 w-full text-primary items-center font-bold"
      >
        <button className="py-2 text-left ">NAME</button>
        <button className="py-2 text-left">EMAIL</button>
        <button className="py-2 text-left">ROLE</button>
      </div>

      {members.map((member) => (
        <Fragment>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div
            key={member.id}
            className="grid grid-cols-3 w-full items-center text-left py-2 hover:cursor-pointer hover:bg-slate-50"
            onClick={() => onClick(true, member.userId)}
          >
            <span className="text-primary">{member.name}</span>
            <span className="text-primary">{member.email}</span>
            <span className="text-primary">
              {member.role === "siteOwner"
                ? "Site Owner"
                : member.role === "siteAdmin"
                  ? "Site Admin"
                  : member.role === "user"
                    ? "User"
                    : "Participant"}
            </span>
          </div>
        </Fragment>
      ))}
      {members && members.length === 0 && (
        <div className="text-primary">No results found</div>
      )}
    </Fragment>
  );
};

export default MembersList;
