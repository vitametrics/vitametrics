import { useOrg } from "../../helpers/OrgContext";
import { useAuth } from "../../helpers/AuthContext";
import { useDashboard } from "../../helpers/DashboardContext";
import { useState, useEffect } from "react";
import { WarningIcon } from "../../assets/WarningIcon";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Settings = () => {
  const { orgName } = useOrg();
  const { isEmailVerified, userEmail, isOrgOwner } = useAuth();
  const { setShowBackDrop, showBackDrop } = useDashboard();

  const [changePasswordFlag, setChangePasswordFlag] = useState(false);
  const [changePasswordMsg, setChangePasswordMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const [debouncedConfirmPassword, setDebouncedConfirmPassword] = useState("");

  const [changeEmailMsg, setChangeEmailMsg] = useState("");
  const [changeEmailFlag, setChangeEmailFlag] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [debounceDeleteConfirmPassword, setDebounceDeleteConfirmPassword] =
    useState("");
  const [deletePasswordMsg, setDeletePasswordMsg] = useState("");

  const [verificationLinkMsg, setVerificationLinkMsg] = useState("");
  const [verificationLinkFlag, setVerificationLinkFlag] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const [searchParams, setSearchParams] = useSearchParams({
    view: "settings",
    showDeleteMenu: "false",
  });

  const showDeleteMenu = searchParams.get("showDeleteMenu") === "true";

  useEffect(() => {
    if (showDeleteMenu) setShowBackDrop(showDeleteMenu);
  }, []);

  const CHANGE_PASSWORD_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_CHANGE_PASSWORD_ENDPOINT
      : import.meta.env.VITE_APP_CHANGE_PASSWORD_DEV_ENDPOINT;

  const CHANGE_EMAIL_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_CHANGE_EMAIL_ENDPOINT
      : import.meta.env.VITE_APP_CHANGE_EMAIL_DEV_ENDPOINT;

  const SEND_VERIFICATION_LINK_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_SEND_EMAIL_VERIFICATION_ENDPOINT
      : import.meta.env.VITE_APP_SEND_EMAIL_VERIFICATION_DEV_ENDPOINT;

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedPassword(password);
    }, 200);
    return () => clearTimeout(delayInputTimeoutId);
  }, [password]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedConfirmPassword(confirmPassword);
    }, 200);
    return () => clearTimeout(timerId);
  }, [confirmPassword]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedEmail(newEmail);
    }, 200);
    return () => clearTimeout(timerId);
  }, [newEmail]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceDeleteConfirmPassword(deletePassword);
      console.log(debounceDeleteConfirmPassword);
    }, 200);
    return () => clearTimeout(timerId);
  }, [deletePassword]);

  const handleAccountDeletion = async () => {
    if (deletePassword === "") {
      setDeletePasswordMsg("ERROR: Password cannot be empty");
      return;
    }
    try {
      await axios.post(
        "https://vitametrics.org/api/user/delete-account",
        {
          password: debounceDeleteConfirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      window.location.href = "/";
    } catch (error) {
      setDeletePasswordMsg("ERROR: Incorrect password!");
      console.log(error);
    }
  };

  const renderDeleteMenu = () => {
    if (showDeleteMenu) {
      return (
        <motion.div
          variants={fadeInItemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          ref={ref}
          className={`opacity-transition ${showBackDrop ? "show" : ""} absolute w-full  p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:w-[500px] rounded-xl text-black`}
        >
          <button
            onClick={() => toggleDeleteMenu(false)}
            className="item-3 ml-auto"
          ></button>
          <h1 className="text-3xl mb-3 text-center w-full">Delete Account</h1>
          <p className="text-yellow-500 text-center w-full mb-5">
            Are you sure you want to delete your account? <br />
            This action is irreversible.
          </p>
          <p className="text-red-500 text-center p-5"> {deletePasswordMsg}</p>
          <h1 className="text-xl mb-1">Enter Password</h1>
          <input
            type="password"
            value={deletePassword}
            className="w-full h-10 p-6 rounded-xl mb-5"
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          <button
            className="bg-red-400 p-4 text-xl w-full rounded-lg"
            onClick={handleAccountDeletion}
          >
            Delete Account
          </button>
        </motion.div>
      );
    }
  };

  const toggleDeleteMenu = (show: boolean) => {
    setSearchParams((prev) => {
      prev.set("showDeleteMenu", show.toString());
      return prev;
    });
    setShowBackDrop(show);
  };

  const handleChangeEmail = async () => {
    if (!debouncedEmail) {
      setChangeEmailMsg("Email cannot be empty");
      return;
    }
    try {
      await axios.post(
        CHANGE_EMAIL_ENDPOINT!,
        {
          email: debouncedEmail,
        },
        {
          withCredentials: true,
        }
      );

      setNewEmail("");
      setChangeEmailFlag(true);
      setChangeEmailMsg("Email successfully changed!");
    } catch (error) {
      setChangeEmailFlag(false);
      setChangeEmailMsg("Error sending email address");
      console.log(error);
    }
  };

  function passwordSuccess() {
    setDebouncedPassword("");
    setPassword("");
    setConfirmPassword("");
    setDebouncedConfirmPassword("");
    setChangePasswordFlag(true);
    setChangePasswordMsg("Password changed successfully");
  }

  const changePassword = async () => {
    if (debouncedPassword !== debouncedConfirmPassword) {
      setChangePasswordMsg("Passwords do not match");
      return;
    }

    if (debouncedPassword.length < 8) {
      setChangePasswordMsg("Password must be at least 8 characters long");
      return;
    }

    try {
      await axios.post(
        CHANGE_PASSWORD_ENDPOINT!,
        {
          password: debouncedPassword,
        },
        {
          withCredentials: true,
        }
      );

      passwordSuccess();
    } catch (error) {
      setChangePasswordFlag(false);
      console.log(error);
    }
  };

  const sendVerificationLink = async () => {
    try {
      await axios.post(SEND_VERIFICATION_LINK_ENDPOINT!, {
        withCredentials: true,
      });

      setVerificationLinkMsg("Verification link sent!");
      setVerificationLinkFlag(true);
    } catch (error) {
      setVerificationLinkMsg("Error sending verification link");
      setVerificationLinkFlag(false);
      console.log(error);
    }
  };

  const fadeInItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={ref}
      className="w-full h-full flex flex-col p-[3.75rem] text-white  "
    >
      {renderDeleteMenu()}
      <h2 className="w-full text-4xl font-ralewayBold text-white mb-10">
        {orgName} Settings
      </h2>

      {!isEmailVerified ? (
        <div className="flex-col my-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <div className="flex flex-row items-center gap-2">
              <WarningIcon />
              <p className="text-lg text-[#ffdd00]">Email not verified:</p>
            </div>
            {userEmail}
          </div>
          {verificationLinkFlag ? (
            <p className="text-green-500 mt-2 font-bold">
              {verificationLinkMsg}
            </p>
          ) : (
            <p className="text-red-500 mt-2 font-bold">{verificationLinkMsg}</p>
          )}
          <button
            onClick={sendVerificationLink}
            className="p-2 bg-[#373737]  rounded-md text-white"
          >
            Send Verification Link
          </button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <span className="check" />
          <p className="text-lg text-white"> {userEmail} </p>
        </div>
      )}
      <div className="flex-col flex mt-10 mb-10">
        <h2 className="w-full text-3xl font-ralewayBold text-white">
          Change Password
        </h2>
        {changePasswordFlag ? (
          <p className="text-green-500 mt-2 font-bold">{changePasswordMsg}</p>
        ) : (
          <p className="text-red-500 mt-2 font-bold">{changePasswordMsg}</p>
        )}
        <input
          type="password"
          value={password}
          className="w-full md:w-[500px] h-12 p-5 mt-2 text-lg text-black bg-white  dark:bg-opacity-10 rounded-lg border-none"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          value={confirmPassword}
          className="w-full md:w-[500px] h-12 p-5 mt-5 text-lg text-black bg-white dark:bg-opacity-10 rounded-lg border-none"
          placeholder="Confirm New Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          className="w-full md:w-[500px] h-12 mt-5 bg-[#585858] text-white text-lg font-ralewayBold rounded-lg"
          onClick={changePassword}
        >
          Change Password
        </button>
      </div>
      <div className="flex-col flex mt-10 mb-10">
        <h2 className="w-full text-3xl font-ralewayBold text-white">
          Change Email
        </h2>
        {changeEmailFlag ? (
          <p className="text-green-500 mt-2 font-bold"> {changeEmailMsg}</p>
        ) : (
          <p className="text-red-500 mt-2 font-bold">{changeEmailMsg}</p>
        )}

        <input
          type="email"
          value={newEmail}
          className="w-full md:w-[500px] h-12 p-5 mt-2 text-lg text-black bg-white  dark:bg-opacity-10 rounded-lg border-none"
          placeholder="New Email"
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <button
          className="w-full md:w-[500px] h-12 mt-5 bg-[#585858] text-white text-lg font-ralewayBold rounded-lg"
          onClick={handleChangeEmail}
        >
          Verify Email Address
        </button>
      </div>
      {!isOrgOwner && (
        <button
          className="bg-red-400 p-4 text-xl w-full rounded-lg md:w-[350px]"
          onClick={() => toggleDeleteMenu(true)}
        >
          Delete Account
        </button>
      )}
    </motion.div>
  );
};

export default Settings;
