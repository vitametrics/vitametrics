import { useProject } from "../../helpers/ProjectContext";
import { useAuth } from "../../helpers/AuthContext";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import useDebounce from "../../helpers/useDebounce";
import { useEffect, useState } from "react";
import axios from "axios";

const Members = () => {
  const ADD_MEMBER_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_ADD_MEMBER_ENDPOINT
      : import.meta.env.VITE_APP_ADD_MEMBER_DEV_ENDPOINT;
  const REMOVE_MEMBER_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_REMOVE_MEMBER_ENDPOINT
      : import.meta.env.VITE_APP_REMOVE_MEMBER_DEV_ENDPOINT;
  const fadeInItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const { ref, inView } = useInView({
    threshold: 0.1, // Adjust based on when you want the animation to trigger (1 = fully visible)
    triggerOnce: true, // Ensures the animation only plays once
  });
  const { projectName, members, fetchProject } = useProject();
  const { userId, isOwner } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams({
    view: "members",
    showInviteMenu: "false",
    email: "",
    name: "",
    member: "",
    invited: "false",
    role: "user",
  });
  const showInviteMenu = searchParams.get("showInviteMenu") === "true";
  const member = searchParams.get("member") || "";
  const { setShowBackDrop, showBackDrop } = useProject();
  const [emailInput, setEmailInput] = useState(searchParams.get("email") || "");
  const [nameInput, setNameInput] = useState(searchParams.get("name") || "");
  const role = searchParams.get("role") || "user";

  const [msg, setMsg] = useState("");

  const invited = searchParams.get("invited") === "true";
  const [confirmDelete, setConfirmDelete] = useState({
    id: "",
    confirm: false,
  });
  const debouncedEmail = useDebounce(emailInput, 500);
  const debouncedName = useDebounce(nameInput, 500);

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  useEffect(() => {
    if (showInviteMenu) setShowBackDrop(showInviteMenu);
    if (member) setShowBackDrop(true);
  }, []);

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("email", debouncedEmail);
      return newParams;
    });
  }, [debouncedEmail]);

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmailInput(event.target.value);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirmDelete.confirm && confirmDelete.id === memberId) {
      try {
        await axios.post(
          REMOVE_MEMBER_ENDPOINT,
          {
            userId: memberId,
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

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("name", debouncedEmail);
      return newParams;
    });
  }, [debouncedName]);

  const handleClose = () => {
    toggleMemberInfo(false, "");
    setConfirmDelete({ id: "", confirm: false });
  };

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNameInput(event.target.value);
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
    setShowBackDrop(show); // Show or hide backdrop when invite menu is toggled
  };

  const toggleMemberInfo = (show: boolean, id: string) => {
    setShowBackDrop(show);
    setSearchParams((prev) => {
      prev.set("member", id);
      return prev;
    });
  };

  const renderMemberInfo = () => {
    const member = searchParams.get("member");
    if (member) {
      const user = members.find((m) => m.userId === member);
      if (!user) return null;

      return (
        <motion.div
          variants={fadeInItemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          ref={ref}
          className="absolute w-full h-full p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[35%] md:w-[500px] rounded-xl"
        >
          <button
            onClick={() => handleClose()}
            className="item-3 ml-auto"
          ></button>
          <h1 className="text-2xl text-center font-bold"> Member Info</h1>
          <h1 className="text-2xl mb-3 text-center">{user.name}</h1>
          <h1 className="text-xl mb-1">{user.email}</h1>
          {isOwner && userId != user.userId ? (
            <button
              onClick={() => handleRemoveMember(user.userId)}
              className={`w-full mt-auto ${confirmDelete.id === user.userId && confirmDelete.confirm ? "bg-yellow-500" : "bg-red-500"} text-white p-3 rounded-lg`}
            >
              {confirmDelete.id === user.userId && confirmDelete.confirm
                ? "Confirm Remove"
                : "Remove"}
            </button>
          ) : null}
        </motion.div>
      );
    }
  };

  const renderInviteMenu = () => {
    if (showInviteMenu) {
      return (
        <motion.div
          variants={fadeInItemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          ref={ref}
          className={`opacity-transition ${showBackDrop ? "show" : ""} absolute w-full h-full p-10 z-10 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[500px] md:w-[500px] rounded-xl`}
        >
          <button
            onClick={() => toggleInviteMenu(false)}
            className="item-3 ml-auto p-2"
          ></button>
          <h1 className="text-2xl mb-3 text-center w-full font-bold text-primary">
            Invite to {projectName}
          </h1>
          {invited ? (
            <p className="text-yellow-500 text-center w-full mb-1"> {msg} </p>
          ) : (
            <p className="text-red-500 text-center w-full mb-1"> {msg} </p>
          )}
          <h1 className="text-xl mb-1 text-primary">Enter Name</h1>
          <input
            type="text"
            className="w-full h-10 p-6 rounded-xl mb-5 text-primary"
            placeholder="Enter member's name"
            value={nameInput}
            onChange={handleNameChange}
          />
          <h1 className="text-xl mb-1 text-primary">Enter Email</h1>
          <input
            type="text"
            className="w-full h-10 p-6 rounded-xl mb-5 text-primary"
            placeholder="Enter member's email"
            value={emailInput}
            onChange={handleEmailChange}
          />
          <h1 className="text-xl mb-1 text-primary">Select Role</h1>
          <select
            className="w-full text-lg p-2 h-10 rounded-xl mb-5 text-primary"
            value={role}
            name="role"
            id="role"
            onChange={(e) =>
              setSearchParams(
                (prev) => {
                  prev.set("role", e.target.value);
                  return prev;
                },
                { replace: true }
              )
            }
          >
            <option value="defaultRole" disabled>
              -- SELECT ROLE --
            </option>
            {roleOptions.map((option) => (
              <option
                className="text-primary"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleInvite()}
            className="w-full p-3 rounded-xl text-white bg-primary shadow-lg font-bold"
          >
            Invite Member
          </button>
        </motion.div>
      );
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
      const response = await axios.post(ADD_MEMBER_ENDPOINT, {
        params: {
          email: debouncedEmail,
          name: debouncedName,
          role: role,
          projectId: searchParams.get("id"),
        },
        withCredentials: true,
      });

      //console.log(response.data);
      setSearchParams((prev) => {
        prev.set("invited", "true");
        return prev;
      });
      setMsg(response.data.msg);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 font-libreFranklin"
    >
      {renderInviteMenu()}
      {renderMemberInfo()}
      <h2 className="w-full text-4xl font-bold p-5 pb-0">
        {projectName} Members
      </h2>
      {isOwner && (
        <div className="flex p-5 w-full">
          <button
            onClick={() => toggleInviteMenu(true)} // Close invite menu when clicking the button
            className="p-2 text-2xl flex flex-row gap-2 justify-center items-center rounded-xl w-[230px] bg-primary font-bold text-white"
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
          <h2 className="text-2xl font-bold">No Members Found.</h2>
        )}
      </div>
    </motion.div>
  );
};

export default Members;
