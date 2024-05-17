import { Fragment } from "react";

interface OverviewMembersListProps {
  members: any[];
}

const OverviewMembersList: React.FC<OverviewMembersListProps> = ({
  members,
}) => {
  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-3 w-full text-primary items-center font-bold"
      >
        <button className="p-2">NAME</button>
        <button className="p-2">EMAIL</button>
        <button className="p-2">ROLE</button>
      </div>
      {members.map((member) => (
        <Fragment>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div
            key={member.id}
            className="grid grid-cols-3 w-full items-center text-center p-2"
          >
            <span className="text-primary ml-2">{member.name}</span>
            <span className="text-primary ml-2">{member.email}</span>
            <span className="text-primary ml-2">{member.role}</span>
          </div>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default OverviewMembersList;
