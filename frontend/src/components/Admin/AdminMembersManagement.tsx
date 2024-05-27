import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../hooks/animationVariant";
//import { MembersList } from "../../components/Dashboard/Members/MembersList";

const AdminMembersManagement = () => {
  const { ref, inView } = useCustomInView();

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
    >
      <h1 className="w-full text-4xl font-bold text-primary pb-0">
        Admin Members Management
      </h1>
    </motion.div>
  );
};

export default AdminMembersManagement;
