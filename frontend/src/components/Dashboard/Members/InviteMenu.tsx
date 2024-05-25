// components/InviteMenu.tsx
import React, { useState, Fragment } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";

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

  if (!showInviteMenu || userRole === "user") return null;

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
            onChange={handleRoleChange}
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
            onClick={handleInvite}
            className="w-full p-3 rounded-xl text-white bg-primary shadow-lg font-bold"
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
            className="w-full h-10 p-6 rounded-xl mb-5 text-primary"
            placeholder="Enter member's name"
            value={tempUserNameInput}
            onChange={handleTempUserNameChange}
          />
          <h1 className="text-xl mb-1 text-primary">Enter Email</h1>
          <input
            type="text"
            className="w-full h-10 p-6 rounded-xl mb-5 text-primary"
            placeholder="Enter member's email"
            value={tempUserEmailInput}
            onChange={handleTempUserEmailChange}
          />
          <button
            onClick={handleTempUserInvite}
            className="w-full p-3 rounded-xl text-white bg-primary shadow-lg font-bold"
          >
            Invite Participant
          </button>
        </Fragment>
      )}
    </motion.div>
  );
};

export default InviteMenu;
