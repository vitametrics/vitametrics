/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Navbar from "../components/Navigation/Navbar";
import logo from "../assets/images/vitamix.webp";
import Footer from "../components/Navigation/Footer";
import useDebounce from "../helpers/useDebounce";
import { useNavigate } from "react-router-dom";
import MailIcon from "../assets/MailIcon";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email, 100);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleForgotPassword();
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(debouncedEmail);
      setSuccess(true);
      setMsg("Password reset link sent to your email");
    } catch (error: any) {
      if (email === "") {
        const errorMessage = "Please enter your email";
        setSuccess(false);
        setMsg(errorMessage);
        return;
      }
      const errorMessage = "Failed to send password reset link";
      setSuccess(false);
      setMsg(errorMessage);
    }
  };

  return (
    <div className="h-full w-full bg-fixed overflow-y-hidden  font-neueHassUnica">
      <Navbar />
      <div className="flex flex-col justify-center items-center p-0 md:p-10">
        <div className="flex flex-row h-screen items-center justify-center">
          <div className="flex flex-col pt-32 items-center justify-center bg-glass w-full h-full md:w-[500px] md:h-[600px]  p-20 md:pt-20 rounded-none md:rounded-xl ">
            <a href="/" className="mb-5">
              <img
                src={logo}
                onClick={() => navigate("/")}
                className="h-20 rounded-xl border-primary"
                alt="VitametricsLogo"
              />
            </a>
            <h2 className="font-bold text-3xl w-72 mt-5 mb-3 text-center text-primary">
              Forgot Password
            </h2>
            <a
              className={` mb-2 ${success ? "text-green-700" : "text-red-500"} `}
            >
              {" "}
              {msg}{" "}
            </a>
            <p className="text-primary mr-auto">Email</p>
            <div className="flex items-center w-full bg-inputBg p-1 rounded-lg">
              <MailIcon />
              <input
                className="p-[10px] w-full text-black"
                type="text"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <a
              href="/login"
              className="text-desc opacity-60 mt-2 mr-auto hover:opacity-80"
            >
              Login instead?
            </a>
            <button
              onKeyDown={handleKeyDown}
              onClick={() => handleForgotPassword()}
              className="p-3 mt-5 bg-secondary hover:bg-hoverSecondary w-full rounded-lg cursor-pointer font-bold text-white"
            >
              Send Verification Link
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
