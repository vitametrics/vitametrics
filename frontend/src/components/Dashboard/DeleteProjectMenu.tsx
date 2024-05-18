// DeleteProjectMenu.tsx
import { motion } from "framer-motion";
import { fadeInItemVariants } from "../../hooks/animationVariant";

interface DeleteProjectMenuProps {
  show: boolean;
  toggleMenu: (show: boolean) => void;
}

const DeleteProjectMenu: React.FC<DeleteProjectMenuProps> = ({
  show,
  toggleMenu,
}) => {
  if (!show) return null;

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate="show"
      className="opacity-transition absolute w-full p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:w-[500px] rounded-xl text-primary shadow-lg"
    >
      <button
        onClick={() => toggleMenu(false)}
        className="item-3 ml-auto"
      ></button>
      <h1 className="text-3xl mb-10 text-center w-full text-primary font-bold">
        Delete Project
      </h1>
      <p className="text-primary">
        Are you sure you want to delete this project?
      </p>
      {/* Additional buttons or actions can be added here */}
    </motion.div>
  );
};

export default DeleteProjectMenu;
