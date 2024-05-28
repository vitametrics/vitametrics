import React, { useState, Fragment } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";
import { MemberInfoProps } from "../../../types/Member";
import { useProject } from "../../../helpers/ProjectContext";
import axios from "axios";
import SaveButton from "../../Buttons/SaveButton";
import CancelButton from "../../Buttons/CancelButton";
import EditButton from "../../Buttons/EditButton";

const CHANGE_ROLE_ENDPOINT = `${process.env.API_URL}/admin/change-user-role`;

const MemberInfo: React.FC<MemberInfoProps> = ({
  member,
  userId,
  confirmDelete,
  handleRemoveMember,
  handleClose,
}) => {
  const { ref, inView } = useCustomInView();
  const { project } = useProject();
  const [msg, setMsg] = useState("");
  const [flag, setFlag] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const currMember = project.members.find((m) => m.userId === userId);

  const [role, setRole] = useState(
    currMember?.isOwner
      ? "owner"
      : currMember?.isAdmin
        ? "admin"
        : currMember?.role === "user"
          ? "user"
          : "tempUser"
  );

  console.log(role);

  const handleRoleChange = async (role: string) => {
    setIsEditing(false);
    try {
      const res = await axios.post(
        CHANGE_ROLE_ENDPOINT,
        {
          userId: userId,
          role: role,
        },
        { withCredentials: true }
      );
      setMsg(res.data.msg);
      setFlag(true);
    } catch (error) {
      setFlag(false);
      setMsg("Error changing role");
      console.log(error);
    }
  };

  if (!member) return null;

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
          handleClose(), setMsg("");
        }}
        className="ml-auto item-3"
      ></button>
      <h1 className="text-2xl text-center font-bold text-primary">
        Member Info
      </h1>
      {flag ? (
        <p className="text-green-500">{msg}</p>
      ) : (
        <p className="text-red-500"> {msg} </p>
      )}

      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">Name:</strong>
        {member.name}
      </div>
      <div className="text-xl mb-1">
        <strong className="mr-2">Email:</strong> {member.email}
      </div>
      <div className="text-xl mb-1 flex flex-row items-center">
        <strong className="mr-2">Role:</strong>{" "}
        {isEditing ? (
          <Fragment>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              className="flex-1 px-2 rounded"
            >
              <option value="user" onClick={() => setRole("user")}>
                User
              </option>
              <option value="admin" onClick={() => setRole("admin")}>
                Admin
              </option>
            </select>

            <SaveButton onClick={() => handleRoleChange(role)} />
            <CancelButton onClick={() => setIsEditing(false)} />
          </Fragment>
        ) : (
          <div className="items-center flex flex-row">
            {member.isOwner ? "Owner" : member.isAdmin ? "Admin" : "User"}
            {project.isOwner && (
              <EditButton onClick={() => setIsEditing(true)} />
            )}
          </div>
        )}
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
