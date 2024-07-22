// CreateProjectMenu.tsx
import { motion } from "framer-motion";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import CloseButton from "../Buttons/CloseButton";

interface CreateProjectMenuProps {
  show: boolean;
  msg: string;
  toggleMenu: (show: boolean) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  setProjectDescription: (description: string) => void;
  handleCreateProject: () => Promise<void>;
}

const CreateProjectMenu: React.FC<CreateProjectMenuProps> = ({
  show,
  msg,
  toggleMenu,
  projectName,
  setProjectName,
  setProjectDescription,
  handleCreateProject,
}) => {
  if (!show) return null;

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate="show"
      className="opacity-transition absolute w-full p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:w-[500px] rounded-xl text-primary shadow-lg font-neueHassUnica"
    >
      <span className="ml-auto">
        <CloseButton
          onClick={() => {
            toggleMenu(false);
            setProjectName("");
            setProjectDescription("");
          }}
        />
      </span>
      <h1 className="text-3xl mb-3 text-center w-full text-primary font-bold">
        Create New Project
      </h1>
      <p className="text-red-500 text-center">{msg}</p>
      <p className="text-primary font-bold">Enter New Project Name</p>
      <input
        type="text"
        className="p-3 mb-3 rounded border-2 border-gray-300 text-primary"
        value={projectName}
        placeholder="Enter your project name"
        onChange={(e) => setProjectName(e.target.value)}
      />
      <p className="text-primary font-bold">Enter Project Description</p>
      <textarea
        placeholder="Enter your project description"
        className="p-3 mb-3 rounded border-2 border-gray-300 text-primary max-h-[300px]"
        rows={5}
        onChange={(e) => setProjectDescription(e.target.value)}
      ></textarea>
      <button
        className="bg-secondary hover:bg-hoverSecondary p-4 text-xl w-full rounded shadow-md text-white font-bold"
        onClick={handleCreateProject}
      >
        Create
      </button>
    </motion.div>
  );
};

export default CreateProjectMenu;
