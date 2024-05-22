/* eslint-disable @typescript-eslint/no-explicit-any */
// components/MemberInfo.tsx
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface MemberInfoProps {
  member: any;
  isOwner: boolean;
  userId: string;
  confirmDelete: { id: string; confirm: boolean };
  handleRemoveMember: (memberId: string) => void;
  handleClose: () => void;
}

const fadeInItemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const MemberInfo: React.FC<MemberInfoProps> = ({
  member,
  isOwner,
  userId,
  confirmDelete,
  handleRemoveMember,
  handleClose,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (!member) return null;

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="absolute w-full h-full p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[35%] md:w-[500px] rounded-xl text-primary"
    >
      <button onClick={handleClose} className="item-3 ml-auto"></button>
      <h1 className="text-2xl text-center font-bold text-primary">
        Member Info
      </h1>
      <h1 className="text-xl mb-1 text-left">
        <strong>Name:</strong> {member.name}
      </h1>
      <h1 className="text-xl mb-1">
        <strong>Email:</strong> {member.email}
      </h1>
      <h1 className="text-xl mb-1">
        <strong>Role:</strong> {member.role}
      </h1>
      {isOwner && userId !== member.userId ? (
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
