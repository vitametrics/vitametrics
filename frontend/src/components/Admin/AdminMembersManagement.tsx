import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import MembersContainer from "./AdminMembers/MembersContainer";
import { useEffect, useState } from "react";
import { useAuth } from "../../helpers/AuthContext";
import MemberInfo from "./AdminMembers/MembersInfo";
import InviteMenu from "./AdminMembers/InviteMenu";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const REMOVE_MEMBER_ENDPOINT = `${process.env.API_URL}/owner/remove-member`;

const AdminMembersManagement = () => {
  const { ref, inView } = useCustomInView();
  const {
    fetchSiteMembers,
    setShowBackDrop,
    siteMembers,
    showBackDrop,
    userRole,
  } = useAuth();
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
  const [msg, setMsg] = useState("");
  const invited = searchParams.get("invited") === "true";
  const [confirmDelete, setConfirmDelete] = useState({
    id: "",
    confirm: false,
  });

  const toggleInviteMenu = () => {
    setSearchParams((prev) => {
      prev.set("showInviteMenu", String(!showInviteMenu));
      return prev;
    });
    setShowBackDrop(!showInviteMenu);
  };

  const toggleMemberInfo = (show: boolean, id: string) => {
    setShowBackDrop(show);
    setSearchParams((prev) => {
      prev.set("member", id);
      return prev;
    });
  };

  useEffect(() => {
    fetchSiteMembers();
  }, []);

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

        handleClose();
      } catch (error) {
        console.log(error);
      }
    } else {
      setConfirmDelete({ id: memberId, confirm: true });
    }
  };

  useEffect(() => {
    if (showInviteMenu || member) {
      setShowBackDrop(true);
    }
  }, [showInviteMenu]);

  const handleClose = () => {
    toggleMemberInfo(false, "");
    setConfirmDelete({ id: "", confirm: false });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
  };

  const handleInvite = async () => {
    if (!nameInput || !emailInput) {
      setMsg("Name and Email cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${process.env.API_URL}/owner/invite-admin`,
        {
          name: nameInput,
          email: emailInput,
        },
        {
          withCredentials: true,
        }
      );
      setMsg("Invitation sent successfully");
      //change invited to true
      setSearchParams((prev) => {
        prev.set("invited", "true");
        return prev;
      });
      setEmailInput("");
      setNameInput("");
    } catch (error) {
      console.log(error);
      setMsg("Error sending invitation");
    }
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary  font-neueHassUnica"
    >
      <InviteMenu
        showInviteMenu={showInviteMenu}
        showBackDrop={showBackDrop}
        userRole={userRole}
        nameInput={nameInput}
        emailInput={emailInput}
        invited={invited}
        msg={msg}
        handleNameChange={handleNameChange}
        handleEmailChange={handleEmailChange}
        handleInvite={handleInvite}
        toggleInviteMenu={toggleInviteMenu}
      />

      <MemberInfo
        member={siteMembers.find((m) => m.userId === member)}
        userId={member}
        confirmDelete={confirmDelete}
        handleRemoveMember={handleRemoveMember}
        handleClose={handleClose}
      />
      <MembersContainer
        onClick={toggleMemberInfo}
        toggleInviteMenu={toggleInviteMenu}
      />
    </motion.div>
  );
};

export default AdminMembersManagement;
