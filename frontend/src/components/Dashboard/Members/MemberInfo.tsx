import React from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";
import { MemberInfoProps } from "../../../types/Member";
import { useProject } from "../../../helpers/ProjectContext";

const MemberInfo: React.FC<MemberInfoProps> = ({
  member,
  userId,
  confirmDelete,
  handleRemoveMember,
  handleClose,
}) => {
  const { ref, inView } = useCustomInView();
  const { project } = useProject();

  if (!member) return null;

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="absolute w-full h-full p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[35%] md:w-[500px] rounded-xl text-primary"
    >
      <button onClick={() => handleClose()} className="ml-auto item-3"></button>
      <h1 className="text-2xl text-center font-bold text-primary">
        Member Info
      </h1>
      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">Name:</strong>
        {member.name}
      </div>
      <div className="text-xl mb-1">
        <strong className="mr-2">Email:</strong> {member.email}
      </div>
      <div className="text-xl mb-1">
        <strong className="mr-2">Role:</strong>{" "}
        {member.isOwner ? "Owner" : member.isAdmin ? "Admin" : "User"}
      </div>
      {project.isOwner && userId !== member.userId ? (
        <button
          onClick={() => handleRemoveMember(member.userId)}
          className={`w-full mt-auto ${
            confirmDelete.id === member.userId && confirmDelete.confirm
              ? "bg-yellow-500"
              : "bg-red-500"
          } text-white p-3 rounded-lg`}
        >
          {confirmDelete.id === member.userId && confirmDelete.confirm
            ? "Confirm Remove"
            : "Remove"}
        </button>
      ) : null}
    </motion.div>
  );
};

export default MemberInfo;
