/* eslint-disable @typescript-eslint/no-explicit-any */
// components/InviteMenu.tsx
import React, { Fragment } from "react";
import { motion } from "framer-motion";
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";

interface InviteMenuProps {
  showInviteMenu: boolean;
  showBackDrop: boolean;
  userRole: string;
  nameInput: string;
  emailInput: string;
  invited: boolean;
  msg: string;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInvite: () => void;
  toggleInviteMenu: (show: boolean) => void;
}

const InviteMenu: React.FC<InviteMenuProps> = ({
  showInviteMenu,
  showBackDrop,
  userRole,
  nameInput,
  emailInput,
  invited,
  msg,
  handleNameChange,
  handleEmailChange,
  handleInvite,
  toggleInviteMenu,
}) => {
  const { ref, inView } = useCustomInView();

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleEmailChange(event);
  };

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
        Invite Site Admins
      </h1>

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
        <span className="mb-5">
          <input
            type="text"
            className="w-full h-10 p-6 rounded-xl text-primary"
            placeholder="Enter member's email"
            value={emailInput}
            onChange={handleEmailInput}
          />
        </span>

        <button
          onClick={handleInvite}
          className="w-full p-3 rounded-xl text-white bg-primary hover:bg-hoverPrimary shadow-lg font-bold"
        >
          Invite Site Admin
        </button>
      </Fragment>
    </motion.div>
  );
};

export default InviteMenu;
