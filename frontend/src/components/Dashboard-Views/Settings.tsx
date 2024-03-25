import { useOrg } from "../../helpers/OrgContext";
import { useAuth } from "../../helpers/AuthContext";
import { useState, useEffect } from "react";
import { WarningIcon } from "../../assets/WarningIcon";
import { CheckmarkIcon } from "../../assets/CheckmarkIcon";
import axios from "axios";

const Settings = () => {
  const { orgName } = useOrg();
  const { isEmailVerified, userEmail } = useAuth();

  const [changePasswordMsg, setChangePasswordMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const [debouncedConfirmPassword, setDebouncedConfirmPassword] = useState("");

  const [changeEmailMsg, setChangeEmailMsg] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const CHANGE_PASSWORD_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_CHANGE_PASSWORD_ENDPOINT
      : import.meta.env.VITE_APP_CHANGE_PASSWORD_DEV_ENDPOINT;

  const CHANGE_EMAIL_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_CHANGE_EMAIL_ENDPOINT
      : import.meta.env.VITE_APP_CHANGE_EMAIL_DEV_ENDPOINT;

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      console.log("password: " + password);
      setDebouncedPassword(password);
    }, 200);
    return () => clearTimeout(delayInputTimeoutId);
  }, [password]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      console.log("confirm new password: " + confirmPassword);
      setDebouncedConfirmPassword(confirmPassword);
    }, 200);
    return () => clearTimeout(timerId);
  }, [confirmPassword]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      console.log("confirm new email: " + newEmail);
      setDebouncedEmail(newEmail);
    }, 200);
    return () => clearTimeout(timerId);
  }, [newEmail]);

  /*
  const sendVerificationLink = async () => {



  }*/

  const handleChangeEmail = async () => {
    if (!debouncedEmail) {
      setChangeEmailMsg("Email cannot be empty");
      return;
    }
    try {
      const response = await axios.post(
        CHANGE_EMAIL_ENDPOINT,
        {
          email: debouncedEmail,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      setNewEmail("");
      setChangeEmailMsg("Success");
    } catch (error) {
      setChangeEmailMsg("Error sending email address");
      console.log(error);
    }
  };

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
      const response = await axios.post(
        CHANGE_PASSWORD_ENDPOINT,
        {
          password: debouncedPassword,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      setDebouncedPassword("");
      setPassword("");
      setConfirmPassword("");
      setDebouncedConfirmPassword("");
      setChangePasswordMsg("Password changed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-[3.75rem] text-white bg-[#FAF9F6] dark:bg-[#1E1D20] dark:bg-hero-texture">
      <h2 className="w-full text-4xl font-ralewayBold text-[#373F51] dark:text-white mb-10">
        {orgName} Settings
      </h2>

      {!isEmailVerified ? (
        <div className="flex-col my-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <div className="flex flex-row items-center gap-2">
              <WarningIcon />
              <p className="text-lg text-[#ffdd00]">Email not verified:</p>
            </div>
            <p>{userEmail}</p>
          </div>
          <button className="p-2 bg-[#373737] rounded-md text-white">
            Send Verification Link
          </button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <CheckmarkIcon />
          <p className="text-lg text-white"> {userEmail} </p>
        </div>
      )}
      <div className="flex-col flex mt-10 mb-10">
        <h2 className="w-full text-3xl font-ralewayBold text-[#373F51] dark:text-white">
          Change Password
        </h2>
        {changePasswordMsg === "Password changed successfully" ? (
          <p className="text-green-500 mt-2 font-bold">{changePasswordMsg}</p>
        ) : (
          <p className="text-red-500 mt-2 font-bold">{changePasswordMsg}</p>
        )}
        <input
          type="password"
          value={password}
          className="w-full md:w-[500px] h-12 p-5 mt-2 text-lg text-[#373F51] dark:text-white bg-white dark:bg-[#373F51] dark:bg-opacity-10 rounded-lg border-none"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          value={confirmPassword}
          className="w-full md:w-[500px] h-12 p-5 mt-5 text-lg text-[#373F51] dark:text-white bg-white dark:bg-[#373F51] dark:bg-opacity-10 rounded-lg border-none"
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
        <h2 className="w-full text-3xl font-ralewayBold text-[#373F51] dark:text-white">
          Change Email
        </h2>
        {changeEmailMsg === "Success" ? (
          <p className="text-green-500 mt-2 font-bold">
            {" "}
            Verification email sent! Please verify.
          </p>
        ) : (
          <p className="text-red-500 mt-2 font-bold">{changeEmailMsg}</p>
        )}
        <input
          type="email"
          value={newEmail}
          className="w-full md:w-[500px] h-12 p-5 mt-2 text-lg text-[#373F51] dark:text-white bg-white dark:bg-[#373F51] dark:bg-opacity-10 rounded-lg border-none"
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
    </div>
  );
};

export default Settings;
