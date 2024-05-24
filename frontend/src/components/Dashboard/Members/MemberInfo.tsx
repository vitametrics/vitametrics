import React, { useState, Fragment } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";
import { MemberInfoProps } from "../../../types/Member";
import { useProject } from "../../../helpers/ProjectContext";
import EditButton from "../../Buttons/EditButton";
import SaveButton from "../../Buttons/SaveButton";
import CancelButton from "../../Buttons/CancelButton";
import axios from "axios";

const CHANGE_MEMBER_NAME_ENDPOINT = `${process.env.API_URL}/project/change-member-name`;

const MemberInfo: React.FC<MemberInfoProps> = ({
  member,
  userId,
  confirmDelete,
  handleRemoveMember,
  handleClose,
}) => {
  const { ref, inView } = useCustomInView();
  const { isOwner, isAdmin } = useProject();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(member ? member.name : "");

  const handleRenameMember = async () => {
    try {
      console.log("Rename Member to: ", newName);
      await axios.post(
        CHANGE_MEMBER_NAME_ENDPOINT,
        {
          userId: member.userId,
          name: newName,
        },
        {
          withCredentials: true,
        }
      );

      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!member) return null;

  const handleEditButton = () => {
    setEditing(true);
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="absolute w-full h-full p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[35%] md:w-[500px] rounded-xl text-primary"
    >
      <button
        onClick={() => {
          handleClose(), setEditing(false);
        }}
        className="ml-auto item-3"
      ></button>
      <h1 className="text-2xl text-center font-bold text-primary">
        Member Info
      </h1>
      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">Name:</strong>
        {(isOwner && editing) || (isAdmin && editing) ? (
          <Fragment>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-2 border-gray-300 rounded px-2 text-lg mr-2"
            />
            <SaveButton onClick={handleRenameMember} />
            <CancelButton onClick={() => setEditing(false)} />
          </Fragment>
        ) : (
          <Fragment>
            {member.name}
            {isOwner && <EditButton onClick={handleEditButton} />}
          </Fragment>
        )}
      </div>
      <div className="text-xl mb-1">
        <strong className="mr-2">Email:</strong> {member.email}
      </div>
      <div className="text-xl mb-1">
        <strong className="mr-2">Role:</strong>{" "}
        {member.isOwner ? "Owner" : member.isAdmin ? "Admin" : "User"}
      </div>
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
