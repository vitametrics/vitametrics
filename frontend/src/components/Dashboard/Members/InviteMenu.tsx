// components/InviteMenu.tsx
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface InviteMenuProps {
  projectName: string;
  showInviteMenu: boolean;
  showBackDrop: boolean;
  userRole: string;
  nameInput: string;
  emailInput: string;
  role: string;
  invited: boolean;
  msg: string;
  roleOptions: { value: string; label: string }[];
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleInvite: () => void;
  toggleInviteMenu: (show: boolean) => void;
}

const fadeInItemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const InviteMenu: React.FC<InviteMenuProps> = ({
  projectName,
  showInviteMenu,
  showBackDrop,
  userRole,
  nameInput,
  emailInput,
  role,
  invited,
  msg,
  roleOptions,
  handleNameChange,
  handleEmailChange,
  handleRoleChange,
  handleInvite,
  toggleInviteMenu,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
    </motion.div>
  );
};

export default InviteMenu;
