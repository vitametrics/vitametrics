import React, { useState, Fragment, useEffect } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";
import { MemberInfoProps } from "../../../types/Member";
import EditButton from "../../Buttons/EditButton";
import CancelButton from "../../Buttons/CancelButton";
import SaveButton from "../../Buttons/SaveButton";
import axios from "axios";
import { useAuth } from "../../../helpers/AuthContext";

type EditableFields = "name" | "email" | "role";

const MemberInfo: React.FC<MemberInfoProps> = ({
  member,
  memberUserId,
  confirmDelete,
  handleRemoveMember,
  handleClose,
}) => {
  const { ref, inView } = useCustomInView();
  const [editMode, setEditMode] = useState<{
    [key in EditableFields]: boolean;
  }>({
    name: false,
    email: false,
    role: false,
  });

  const { siteMembers, setSiteMembers, userId } = useAuth();
  const siteMember = siteMembers.find(
    (member) => member.userId === memberUserId
  );
  const [msg, setMsg] = useState("");
  const [flag, setFlag] = useState(false);

  const [editedMember, setEditedMember] = useState({
    name: siteMember?.name || "",
    email: siteMember?.email || "",
    role: siteMember?.role || "",
  });

  useEffect(() => {
    const siteMember = siteMembers.find((m) => m.userId === memberUserId);
    if (siteMember) {
      setEditedMember({
        name: siteMember.name,
        email: siteMember.email,
        role: siteMember.role,
      });
    }
  }, [siteMembers, memberUserId]);

  if (!member) return null;

  const handleEditChange = (field: EditableFields, value: string) => {
    setEditedMember((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = (field: EditableFields) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const isSelf = siteMember.userId === userId;

  const handleEdits = async (type: EditableFields) => {
    toggleEditMode(type);

    try {
      const response = await axios.put(
        `${process.env.API_URL}/owner/user/${siteMember._id}`,
        {
          email: editedMember.email,
          name: editedMember.name,
          role: editedMember.role,
        },
        { withCredentials: true }
      );
      console.log(response);
      const updatedUser = response.data;
      const updatedMembers = siteMembers.map((member) =>
        member.userId === updatedUser.userId ? updatedUser : member
      );
      setFlag(true);
      setSiteMembers(updatedMembers);
      setEditedMember(updatedUser);
      setMsg("Member info updated");
    } catch (error) {
      setFlag(false);
      setMsg("Error updating member info");
      console.log(error);
    }
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="absolute w-full h-[500px] p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[500px] md:w-[500px] rounded-xl text-primary"
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
        <p className="text-green-500"> {msg}</p>
      ) : (
        <p className="text-red-500"> {msg} </p>
      )}

      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">Name:</strong>
        {editMode.name ? (
          <input
            type="text"
            value={editedMember.name}
            onChange={(e) => handleEditChange("name", e.target.value)}
            className="flex-1 px-2 rounded"
          />
        ) : (
          member.name
        )}
        {siteMember.role !== "siteOwner" && (
          <Fragment>
            {editMode.name ? (
              <Fragment>
                <SaveButton onClick={() => handleEdits("name")} />
                <CancelButton onClick={() => toggleEditMode("name")} />
              </Fragment>
            ) : (
              <EditButton onClick={() => toggleEditMode("name")} />
            )}
          </Fragment>
        )}
      </div>
      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">UID:</strong>
        {memberUserId}
      </div>
      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">Email:</strong>
        {editMode.email ? (
          <input
            type="text"
            value={editedMember.email}
            onChange={(e) => handleEditChange("email", e.target.value)}
            className="flex-1 px-2 rounded"
          />
        ) : (
          member.email
        )}
        {siteMember.role !== "siteOwner" && (
          <Fragment>
            {editMode.email ? (
              <Fragment>
                <SaveButton onClick={() => handleEdits("email")} />
                <CancelButton onClick={() => toggleEditMode("email")} />
              </Fragment>
            ) : (
              <EditButton onClick={() => toggleEditMode("email")} />
            )}
          </Fragment>
        )}
      </div>

      <div className="text-xl mb-1 text-left flex items-center">
        <strong className="mr-2">Role:</strong>
        {editMode.role ? (
          <select
            value={editedMember.role}
            onChange={(e) => handleEditChange("role", e.target.value)}
            className="flex-1 rounded "
          >
            {siteMember.role !== "siteOwner" && (
              <Fragment>
                <option value="siteOwner">Site Owner</option>
                <option value="siteAdmin">Site Admin</option>
                <option value="user">Site User</option>
              </Fragment>
            )}
          </select>
        ) : member.role === "siteOwner" ? (
          "Site Owner"
        ) : member.role === "siteAdmin" ? (
          "Site Admin"
        ) : (
          member.role === "user" && "User"
        )}
        {siteMember.role !== "siteOwner" && (
          <Fragment>
            {editMode.role ? (
              <Fragment>
                <SaveButton onClick={() => handleEdits("role")} />
                <CancelButton onClick={() => toggleEditMode("role")} />
              </Fragment>
            ) : (
              <EditButton onClick={() => toggleEditMode("role")} />
            )}
          </Fragment>
        )}
      </div>

      {!isSelf && (
        <button
          onClick={() => {
            handleRemoveMember(member._id);
          }}
          className={`w-full mt-auto ${
            confirmDelete.id === member._id && confirmDelete.confirm
              ? "bg-yellow-500"
              : "bg-red-400"
          } text-white p-3 rounded-lg`}
        >
          {confirmDelete.id === member._id && confirmDelete.confirm
            ? "Confirm Remove"
            : "Remove"}
        </button>
      )}
    </motion.div>
  );
};

export default MemberInfo;
