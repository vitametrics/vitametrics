/* eslint-disable @typescript-eslint/no-explicit-any */
// components/InviteMenu.tsx
import React, { useState, Fragment, useEffect } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import axios from "axios";
import { useProject } from "../../helpers/ProjectContext";
import CloseButton from "../Buttons/CloseButton";

interface InviteMenuProps {
  projectName: string;
  showInviteMenu: boolean;
  showBackDrop: boolean;
  userRole: string;
  nameInput: string;
  emailInput: string;
  tempUserNameInput: string;
  tempUserEmailInput: string;
  role: string;
  invited: boolean;
  msg: string;
  roleOptions: { value: string; label: string }[];
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTempUserNameChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleTempUserEmailChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleTempUserInvite: () => void;
  handleInvite: () => void;
  toggleInviteMenu: (show: boolean) => void;
  handleTabChange: () => void;
}

const InviteMenu: React.FC<InviteMenuProps> = ({
  projectName,
  showInviteMenu,
  showBackDrop,
  userRole,
  nameInput,
  emailInput,
  tempUserNameInput,
  tempUserEmailInput,
  role,
  invited,
  msg,
  roleOptions,
  handleNameChange,
  handleTempUserNameChange,
  handleEmailChange,
  handleTempUserEmailChange,
  handleRoleChange,
  handleInvite,
  handleTempUserInvite,
  toggleInviteMenu,
  handleTabChange,
}) => {
  const { ref, inView } = useCustomInView();
  const [tab, setTab] = useState("user");
  const { project } = useProject();
  const [availableUsers, setAvailableUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempUsers, setTempUsers] = useState<any[]>([]);
  const [filteredTempUsers, setFilteredTempUsers] = useState<any[]>([]);
  const [showTempUserDropdown, setShowTempUserDropdown] = useState(false);

  const GET_AVAILABLE_USERS_ENDPOINT = `${process.env.API_URL}/admin/get-available-users`;

  useEffect(() => {
    if (availableUsers.length === 0) {
      fetchAvailableUsers();
    }
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(GET_AVAILABLE_USERS_ENDPOINT, {
        params: {
          projectId: project.projectId,
        },
        withCredentials: true,
      });
      const availableUsers = response.data.availableUsers.filter(
        (user: any) => !user.isTempUser
      );

      const tempUsers = response.data.availableUsers.filter(
        (user: any) => user.isTempUser === true
      );

      setAvailableUsers(availableUsers);
      setTempUsers(tempUsers);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleEmailChange(event);
    const input = event.target.value.toLowerCase();

    if (input.length >= 3) {
      const filteredUsers = availableUsers.filter((user: any) =>
        user.email.toLowerCase().includes(input)
      );
      setFilteredUsers(filteredUsers);
      setShowDropdown(true);
    } else {
      setFilteredUsers([]);
      setShowDropdown(false);
    }
  };

  const handleTempUserEmailInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleTempUserEmailChange(event);
    const input = event.target.value.toLowerCase();

    if (input.length >= 3) {
      const filteredUsers = tempUsers.filter((user: any) =>
        user.email.toLowerCase().includes(input)
      );
      setFilteredTempUsers(filteredUsers);
      setShowTempUserDropdown(true);
    } else {
      setFilteredTempUsers([]);
      setShowTempUserDropdown(false);
    }
  };

  if (!showInviteMenu || userRole === "user") return null;

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className={`opacity-transition ${showBackDrop ? "show" : ""} absolute w-full h-full p-10 z-10 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:h-[600px] md:w-[500px] rounded-xl`}
    >
      <span className="ml-auto">
        <CloseButton onClick={() => toggleInviteMenu(false)} />
      </span>
      <h1 className="text-2xl mb-3 text-center w-full font-bold text-primary">
        Invite to {projectName}
      </h1>
      <div className="flex flex-row gap-3 text-secondary2">
        <span
          className={`${tab === "user" ? "selected-tab" : ""} hover:cursor-pointer`}
          onClick={() => {
            setTab("user"), handleTabChange();
          }}
        >
          User
        </span>
        <span
          className={`${tab === "participant" ? "selected-tab" : ""} hover:cursor-pointer`}
          onClick={() => {
            setTab("participant"), handleTabChange();
          }}
        >
          Participant
        </span>
      </div>

      {tab === "user" ? (
        <Fragment>
          {invited ? (
            <p className="text-yellow-500 text-center w-full mb-1">{msg}</p>
          ) : (
            <p className="text-red-500 text-center w-full mb-1">{msg}</p>
          )}
          <h1 className="text-xl mb-1 text-primary">Enter Name</h1>
          <input
            type="text"
            className="w-full h-10 p-6 rounded border-2 border-gray-300 mb-5 text-primary"
            placeholder="Enter member's name"
            value={nameInput}
            onChange={handleNameChange}
          />
          <h1 className="text-xl mb-1 text-primary">Enter Email</h1>
          <span className="mb-5">
            <input
              type="text"
              className="w-full h-10 p-6 rounded border-2 border-gray-300 text-primary"
              placeholder="Enter member's email"
              value={emailInput}
              onChange={handleEmailInput}
            />
            {showDropdown && (
              <div className="w-full bg-white rounded-lg mt-0.5 shadow-lg p-2">
                {filteredUsers.length === 0 ? (
                  <span className="text-primary ">No users found</span>
                ) : (
                  <Fragment>
                    {filteredUsers.map((user) => (
                      <div
                        key={user.userId}
                        className="flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-100 p-2 rounded-lg"
                        onClick={() => {
                          handleEmailChange({
                            target: { value: user.email },
                          } as any),
                            handleNameChange({
                              target: { value: user.name },
                            } as any);
                          setShowDropdown(false);
                        }}
                      >
                        <span className="font-bold text-lg">{user.name}</span>
                        <span className="text-md">{user.email}</span>
                      </div>
                    ))}
                  </Fragment>
                )}
              </div>
            )}
          </span>
          <h1 className="text-xl mb-1 text-primary">Select Role</h1>
          <select
            className="w-full text-lg pl-6 h-10 rounded border-2 border-gray-300  mb-5 text-primary hover:cursor-pointer"
            value={role}
            name="role"
            id="role"
            onChange={handleRoleChange}
          >
            <option value="defaultRole" disabled>
              -- SELECT ROLE --
            </option>
            {roleOptions.map((option) => (
              <option
                className="text-primary hover:cursor-pointer"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleInvite}
            className="w-full p-3 rounded text-white bg-primary shadow-lg font-bold"
          >
            Invite Member
          </button>
        </Fragment>
      ) : (
        <Fragment>
          {invited ? (
            <p className="text-yellow-500 text-center w-full mb-1">{msg}</p>
          ) : (
            <p className="text-red-500 text-center w-full my-1">{msg}</p>
          )}
          <h1 className="text-primary my-2">
            <span className="font-bold "> NOTE: </span> Participants{" "}
            <span className="italic underline"> do not </span> have access to
            the project.
          </h1>
          <h1 className="text-xl mb-1 text-primary">Enter Name</h1>
          <input
            type="text"
            className="w-full h-10 p-6 rounded mb-5 text-primary border-2 border-gray-300"
            placeholder="Enter member's name"
            value={tempUserNameInput}
            onChange={handleTempUserNameChange}
          />
          <h1 className="text-xl mb-1 text-primary">Enter Email</h1>
          <input
            type="text"
            className="w-full h-10 p-6 rounded text-primary border-2 border-gray-300"
            placeholder="Enter member's email"
            value={tempUserEmailInput}
            onChange={handleTempUserEmailInput}
          />
          {showTempUserDropdown && (
            <div className="w-full bg-white rounded-lg mt-1 shadow-lg p-2">
              {filteredTempUsers.length === 0 ? (
                <span className="text-primary ">No participants found</span>
              ) : (
                <Fragment>
                  {filteredTempUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-100 p-2 rounded-lg"
                      onClick={() => {
                        handleTempUserEmailChange({
                          target: { value: user.email },
                        } as any),
                          handleTempUserNameChange({
                            target: { value: user.name },
                          } as any);

                        setShowTempUserDropdown(false);
                      }}
                    >
                      <span className="font-bold text-lg">{user.name}</span>
                      <span className="text-md">{user.email}</span>
                    </div>
                  ))}
                </Fragment>
              )}
            </div>
          )}
          <button
            onClick={handleTempUserInvite}
            className="w-full p-3 rounded text-white bg-primary shadow-lg font-bold mt-5"
          >
            Invite Participant
          </button>
        </Fragment>
      )}
    </motion.div>
  );
};

export default InviteMenu;
