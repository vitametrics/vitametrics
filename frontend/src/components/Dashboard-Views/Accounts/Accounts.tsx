/* eslint-disable @typescript-eslint/no-unused-vars */
import useCustomInView from "../../../hooks/useCustomInView";
import { fadeInItemVariants } from "../../../hooks/animationVariant";
import { motion } from "framer-motion";
import AccountsContainer from "./AccountsContainer";

const Accounts = () => {
  const { ref, inView } = useCustomInView();

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary"
    >
      <AccountsContainer />
    </motion.div>
  );
};

export default Accounts;
