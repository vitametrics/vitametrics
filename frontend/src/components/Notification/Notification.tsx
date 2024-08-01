import { useNotification } from "../../helpers/NotificationContext";
import {
  faExclamationTriangle,
  faCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, Fragment, useState } from "react";
import { fadeInItemVariants } from "../../hooks/animationVariant";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";
import useCustomInView from "../../hooks/useCustomInView";

const Notification = () => {
  const { message, success, setMessage } = useNotification();
  const duration = 3000;
  const [progress, setProgress] = useState(0);
  const { ref, inView } = useCustomInView();

  useEffect(() => {
    if (message) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev > 100) {
            clearInterval(interval);
            setMessage("");
            return 100;
          }
          return prev + 1;
        });
      }, duration / 100);

      return () => clearInterval(interval);
    }
  }, [message, setMessage]);

  return (
    <Fragment>
      {message && (
        <motion.div
          variants={fadeInItemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          ref={ref}
          className="flex flex-col fixed bottom-5 right-5 items-center rounded-l rounded-r border-2 bg-[#f3f4f6] border-[#e0e0df] z-50 overflow-hidden"
        >
          <div className="flex flex-row font-neueHassUnica">
            <div
              className={`${success ? "bg-green-400" : "bg-red-400"} text-white font-bold px-4 py-3 border-r-2`}
            >
              {success ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faExclamationTriangle} />
              )}
            </div>
            <div className="rounded-r px-4 py-3 ">
              <p>{message}</p>
            </div>
            <button
              onClick={() => setMessage("")}
              className="px-4 py-3  rounded-r  border-y-0 border-r-0 border-2 border-[#e0e0df] hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <ProgressBar progress={progress} />
        </motion.div>
      )}
    </Fragment>
  );
};

export default Notification;
