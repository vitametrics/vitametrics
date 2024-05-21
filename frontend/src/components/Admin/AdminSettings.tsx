import { fadeInItemVariants } from "../../hooks/animationVariant";
import useCustomInView from "../../hooks/useCustomInView";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import GeneralSettings from "./AdminSettings/GeneralSettings/GeneralSettings";
import MailSettings from "./AdminSettings/MailSettings/MailSettings";
import APISettings from "./AdminSettings/APISettingsTab/APISettings";

const AdminSettings = () => {
  const { ref, inView } = useCustomInView();
  const [searchParams, setSearchParams] = useSearchParams({
    view: "settings",
    tab: "general",
  });
  const tab = searchParams.get("tab") || "general";

  const handleTabChange = (newTab: string) => {
    setSearchParams({ view: "settings", tab: newTab }, { replace: true });
  };

  const renderTab = () => {
    switch (tab) {
      case "general":
        return <GeneralSettings />;
      case "mail":
        return <MailSettings />;
      case "api":
        return <APISettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-10 bg-whitePrimary font-libreFranklin"
    >
      <h1 className="w-full text-4xl font-bold text-primary pb-0">
        Admin Settings
      </h1>
      <div className="flex flex-col w-full mt-5 gap-5">
        <div className="grid grid-cols-3 w-full  text-center bg-primary text-white hover:cursor-pointer">
          <span
            className={`${tab === "general" ? "bg-primary3 border-t-[#F28D59] border-[2px] border-x-0 border-b-0" : ""} p-2`}
            onClick={() => handleTabChange("general")}
          >
            GENERAL
          </span>
          <span
            className={`${tab === "mail" ? "bg-primary3 border-t-[#F28D59] border-[2px] border-x-0 border-b-0" : ""} p-2`}
            onClick={() => handleTabChange("mail")}
          >
            MAIL
          </span>
          <span
            className={`${tab === "api" ? "bg-primary3 border-t-[#F28D59] border-[2px] border-x-0 border-b-0" : ""} p-2`}
            onClick={() => handleTabChange("api")}
          >
            API
          </span>
        </div>

        <div className="bg-transparent">{renderTab()}</div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
