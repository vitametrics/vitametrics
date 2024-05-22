/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Members.tsx
import { useProject } from "../../helpers/ProjectContext";
import { useAuth } from "../../helpers/AuthContext";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import useDebounce from "../../helpers/useDebounce";
import MemberInfo from "../../components/Dashboard/Members/MemberInfo";
import InviteMenu from "../../components/Dashboard/Members/InviteMenu";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";

const Members = () => {
  const ADD_MEMBER_ENDPOINT = `${process.env.API_URL}/admin/add-member`;
  const REMOVE_MEMBER_ENDPOINT = `${process.env.API_URL}/admin/remove-member`;
  const { ref, inView } = useCustomInView();

  const { projectName, members, fetchProject, setShowBackDrop, showBackDrop } =
    useProject();
  const { userRole, userId, isOwner } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams({
    view: "members",
    showInviteMenu: "false",
    member: "",
    invited: "false",
    role: "user",
  });

  const showInviteMenu = searchParams.get("showInviteMenu") === "true";
  const member = searchParams.get("member") || "";
  const [emailInput, setEmailInput] = useState(searchParams.get("email") || "");
  const [nameInput, setNameInput] = useState(searchParams.get("name") || "");
  const role = searchParams.get("role") || "user";
  const [msg, setMsg] = useState("");
  const invited = searchParams.get("invited") === "true";
  const [confirmDelete, setConfirmDelete] = useState({
    id: "",
    confirm: false,
  });

  const debouncedEmail = useDebounce(emailInput, 100);
  const debouncedName = useDebounce(nameInput, 100);

  const roleOptions =
    userRole === "admin"
      ? [{ value: "user", label: "User" }]
      : [
          { value: "user", label: "User" },
          { value: "admin", label: "Admin" },
        ];

  useEffect(() => {
    if (showInviteMenu && userRole !== "user") setShowBackDrop(showInviteMenu);
    if (member) setShowBackDrop(true);
  }, [showInviteMenu, member, userRole, setShowBackDrop]);

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmailInput(event.target.value);
  };

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNameInput(event.target.value);
  };

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSearchParams((prev) => {
      prev.set("role", event.target.value);
      return prev;
    });
  };

  const toggleInviteMenu = (show: boolean) => {
    setSearchParams((prev) => {
      prev.set("showInviteMenu", show.toString());
      return prev;
    });
    setSearchParams((prev) => {
      prev.set("invited", "false");
      return prev;
    });
    setMsg("");
    setShowBackDrop(show);
  };

  const toggleMemberInfo = (show: boolean, id: string) => {
    setShowBackDrop(show);
    setSearchParams((prev) => {
      prev.set("member", id);
      return prev;
    });
  };

  const handleClose = () => {
    toggleMemberInfo(false, "");
    setConfirmDelete({ id: "", confirm: false });
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirmDelete.confirm && confirmDelete.id === memberId) {
      try {
        await axios.post(
          REMOVE_MEMBER_ENDPOINT,
          {
            userId: memberId,
            projectId: searchParams.get("id"),
          },
          {
            withCredentials: true,
          }
        );
        fetchProject();
        handleClose();
      } catch (error) {
        console.log(error);
      }
    } else {
      setConfirmDelete({ id: memberId, confirm: true });
    }
  };

  const validInput = () => {
    if (!debouncedEmail || !debouncedName) {
      setMsg("Both parameters must be filled out.");
      setSearchParams((prev) => {
        prev.set("invited", "false");
        return prev;
      });
      return false;
    }

    if (invited) {
      setMsg("User has already been invited.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(debouncedEmail)) {
      setMsg("Email is invalid.");
      setSearchParams((prev) => {
        prev.set("invited", "false");
        return prev;
      });
      return false;
    }
    return true;
  };

  const handleInvite = async () => {
    if (!validInput()) return;
    try {
      const response = await axios.post(
        ADD_MEMBER_ENDPOINT,
        {
          email: debouncedEmail,
          name: debouncedName,
          role: role,
          projectId: searchParams.get("id"),
        },
        {
          withCredentials: true,
        }
      );

      setSearchParams((prev) => {
        prev.set("invited", "true");
        return prev;
      });
      setMsg(response.data.msg);
    } catch (error: any) {
      setMsg(error.response.data.msg);
      setSearchParams((prev) => {
        prev.set("invited", "false");
        return prev;
      });
      console.log(error);
    }
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="w-full h-full flex flex-col p-10 font-libreFranklin"
    >
      <InviteMenu
        projectName={projectName}
        showInviteMenu={showInviteMenu}
        showBackDrop={showBackDrop}
        userRole={userRole}
        nameInput={nameInput}
        emailInput={emailInput}
        role={role}
        invited={invited}
        msg={msg}
        roleOptions={roleOptions}
        handleNameChange={handleNameChange}
        handleEmailChange={handleEmailChange}
        handleRoleChange={handleRoleChange}
        handleInvite={handleInvite}
        toggleInviteMenu={toggleInviteMenu}
      />
      <MemberInfo
        member={members.find((m) => m.userId === member)}
        isOwner={isOwner}
        userId={userId}
        confirmDelete={confirmDelete}
        handleRemoveMember={handleRemoveMember}
        handleClose={handleClose}
      />
      <h2 className="w-full text-4xl font-bold p-5 pb-0 text-primary">
        {projectName} Members
      </h2>
      {userRole !== "user" && (
        <div className="flex p-5 w-full">
          <button
            onClick={() => toggleInviteMenu(true)}
            className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[230px] bg-primary font-bold text-white shadow-lg"
          >
            Invite
          </button>
        </div>
      )}
      <div className="flex flex-row flex-wrap gap-5 p-5">
        {members.length > 0 ? (
          members.map((member, index: number) => {
            return (
              <div
                key={index}
                onClick={() => toggleMemberInfo(true, member.userId)}
                className="flex flex-row items-center h-[70px] justify-center hover:cursor-pointer bg-secondary rounded-xl p-5"
              >
                <p className="text-xl text-white font-bold text-center">
                  {member.email}
                </p>
              </div>
            );
          })
        ) : (
          <h2 className="text-2xl font-bold text-primary">No Members Found.</h2>
        )}
      </div>
    </motion.div>
  );
};
export default Members;
