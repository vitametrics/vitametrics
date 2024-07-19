import { motion } from "framer-motion";
import useCustomInView from "../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import AccountsContainer from "./AdminAccounts/AdminAccountsContainer";

const AdminAccounts = () => {
  const { ref, inView } = useCustomInView();

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
    >
      <AccountsContainer />
    </motion.div>
  );
};

export default AdminAccounts;
