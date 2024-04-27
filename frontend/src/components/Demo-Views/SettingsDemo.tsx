import { useState, useEffect } from "react";
import { WarningIcon } from "../../assets/WarningIcon";

const SettingsDemo = () => {
  const orgName = "Ada Lovelace's Org";
  const isEmailVerified = true;
  const userEmail = "adalovelace@vitametrics.org";

  const [changePasswordFlag, setChangePasswordFlag] = useState(false);
  const [changePasswordMsg, setChangePasswordMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const [debouncedConfirmPassword, setDebouncedConfirmPassword] = useState("");

  const [changeEmailMsg, setChangeEmailMsg] = useState("");
  const [changeEmailFlag, setChangeEmailFlag] = useState(false);

  const [verificationLinkMsg, setVerificationLinkMsg] = useState("");
  const [verificationLinkFlag, setVerificationLinkFlag] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

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

  function handleChangeEmail() {
    if (!debouncedEmail) {
      setChangeEmailMsg("Email cannot be empty");
      setChangeEmailFlag(false);
      return;
    }

    setChangeEmailFlag(true);
    setChangeEmailMsg("Email changed successfully");
  }

  function passwordSuccess() {
    setDebouncedPassword("");
    setPassword("");
    setConfirmPassword("");
    setDebouncedConfirmPassword("");
    setChangePasswordFlag(true);
    setChangePasswordMsg("Password changed successfully");
  }

  function sendVerificationLink() {
    setVerificationLinkFlag(true);
    setVerificationLinkMsg("Verification Link Sent!");
  }

  function changePassword() {
    if (debouncedPassword !== debouncedConfirmPassword) {
      setChangePasswordMsg("Passwords do not match");
      return;
    }

    if (debouncedPassword.length < 8) {
      setChangePasswordMsg("Password must be at least 8 characters long");
      return;
    }

    passwordSuccess();
  }

  return (
    <div className="w-full h-full flex flex-col p-[3.75rem] text-white  ">
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
    </div>
  );
};

export default SettingsDemo;
