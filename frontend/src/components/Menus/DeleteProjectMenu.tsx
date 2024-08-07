// DeleteProjectMenu.tsx
import { motion } from "framer-motion";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import CloseButton from "../Buttons/CloseButton";

interface DeleteProjectMenuProps {
  show: boolean;
  toggleMenu: (show: boolean, id: string) => void;
  handleDelete: () => void; // Function to handle the deletion process
}

const DeleteProjectMenu: React.FC<DeleteProjectMenuProps> = ({
  show,
  toggleMenu,
  handleDelete,
}) => {
  if (!show) return null;

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate="show"
      className="opacity-transition fixed w-full p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:w-[500px] rounded-xl text-primary shadow-lg"
    >
      <span className="ml-auto">
        <CloseButton onClick={() => toggleMenu(false, "")} />
      </span>

      <h1 className="text-3xl mb-10 text-center w-full text-primary font-bold">
        Delete Project
      </h1>
      <p className="text-primary text-center mb-3 text-lg">
        Are you sure you want to delete this project?
      </p>
      <div className="flex flex-row justify-around items-center gap-2">
        <button
          className="text-white p-3 bg-red-400 hover:bg-red-300 rounded w-full"
          onClick={() => {
            handleDelete();
            toggleMenu(false, "");
          }}
        >
          Yes, Delete it
        </button>
        <button
          className="text-white p-3 bg-secondary hover:bg-hoverSecondary rounded w-full"
          onClick={() => toggleMenu(false, "")}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default DeleteProjectMenu;
