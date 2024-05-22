/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
//import { useHistory } from "react-router-dom";

import axios from "axios";
import Navbar from "../components/Navbar";
import logo from "../assets/images/vitamix.webp";
import Footer from "../components/Footer";
import { useAuth } from "../helpers/AuthContext";
import useDebounce from "../helpers/useDebounce";
import { useNavigate } from "react-router-dom";

const Login = () => {
  console.log(import.meta.env);
  const LOGIN_ENDPOINT = `${process.env.API_URL}/login`;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const debouncedEmail = useDebounce(email, 100);
  const debouncedPassword = useDebounce(password, 100);
  const [msg, setMsg] = useState("");
  const { login } = useAuth();

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        LOGIN_ENDPOINT,
        { email: debouncedEmail, password: debouncedPassword },
        { withCredentials: true }
      );

      if (response.data) {
        login();
      }
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An unknown error occurred";
      setMsg(errorMessage);
    }
  };

  return (
    <div className="h-full w-full bg-fixed overflow-y-hidden font-leagueSpartanBold ">
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
            <h2 className="font-bold text-4xl w-72 mt-5 mb-5 text-center text-primary">
              {" "}
              Login{" "}
            </h2>
            <a className="text-red-500 mb-3"> {msg} </a>
            <input
              className="p-[10px] w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onKeyDown={handleLogin}
              onClick={handleLogin}
              className="p-[10px] mt-5 bg-secondary w-72 rounded-lg cursor-pointer font-bold text-white"
            >
              {" "}
              Login{" "}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
