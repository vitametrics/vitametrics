/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navigation/Navbar";
import logo from "../assets/images/vitamix.webp";
import { useAuth } from "../helpers/AuthContext";
import useDebounce from "../helpers/useDebounce";
import { useNavigate } from "react-router-dom";
import LockIcon from "../assets/LockIcon";
import MailIcon from "../assets/MailIcon";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = () => {
  const LOGIN_ENDPOINT = `${process.env.API_URL}/login`;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const debouncedEmail = useDebounce(email, 100);
  const debouncedPassword = useDebounce(password, 100);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const { login } = useAuth();

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!debouncedEmail || !debouncedPassword) {
      setMsg("Please enter both email and password");
      return;
    }

    try {
      await axios.post(
        LOGIN_ENDPOINT,
        { email: debouncedEmail, password: debouncedPassword },
        { withCredentials: true }
      );

      login();
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An unknown error occurred";
      setMsg(errorMessage);
    }
  };

  return (
    <div className="h-full w-full bg-fixed overflow-y-hidden  font-neueHassUnica ">
      <Navbar />
      <div className="flex flex-col justify-center items-center p-0 md:p-10">
        <div className="flex flex-row h-screen items-center justify-center">
          <div className="flex flex-col pt-32 items-center justify-center bg-container w-full h-full md:w-[500px] md:h-[600px]  p-20 md:pt-20 rounded-none md:rounded-xl ">
            <a href="/" className="mb-5">
              <img
                src={logo}
                onClick={() => navigate("/")}
                className="h-20 rounded-xl border-primary"
                alt="VitametricsLogo"
              />
            </a>
            <h2 className="font-bold text-4xl w-72 mt-5 mb-5 text-center text-primary">
              {" "}
              Login{" "}
            </h2>
            <a className="text-red-500 mb-3"> {msg} </a>
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
            <p className="text-primary mr-auto mt-3">Password</p>
            <div className="flex items-center w-full bg-inputBg p-1 rounded-lg">
              <LockIcon />
              <input
                className="p-[10px] w-full text-black"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="mr-2 cursor-pointer icon-cog"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <a
              href="/forgot-password"
              className="text-desc opacity-60 mt-2 mr-auto hover:opacity-80"
            >
              Forgot Password?
            </a>
            <button
              onKeyDown={handleLogin}
              onClick={handleLogin}
              className="p-3 mt-5 bg-secondary hover:bg-hoverSecondary w-full rounded-lg cursor-pointer font-bold text-white"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
