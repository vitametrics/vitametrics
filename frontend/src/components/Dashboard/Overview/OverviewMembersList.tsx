import { Fragment } from "react";
import { OverviewMembersListProps } from "../../../types/Member";

const OverviewMembersList: React.FC<OverviewMembersListProps> = ({
  members,
}) => {
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
            className="grid grid-cols-3 w-full items-center text-left py-2"
          >
            <span className="text-primary">{member.name}</span>
            <span className="text-primary">{member.email}</span>
            <span className="text-primary">{member.role}</span>
          </div>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default OverviewMembersList;
