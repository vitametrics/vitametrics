import { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";

import axios from "axios";
import Navbar from "../components/Navbar";
import WatchLogo from "../components/Watch";
import logo from "../assets/images/logo.png";
import Footer from "../components/Footer";
import { useAuth } from "../helpers/AuthContext";

const Login = () => {
  //const LOGIN_ENDPOINT = import.meta.env.VITE_APP_LOGIN_ENDPOINT; //~ production
  const LOGIN_ENDPOINT = import.meta.env.VITE_APP_LOGIN_DEV_ENDPOINT; //~development;
  // const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/dashboard?view=data";
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      console.log("Logging in from:", LOGIN_ENDPOINT);

      const response = await axios.post(
        LOGIN_ENDPOINT,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      console.log(response.data);

      if (response.data) {
        login();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full overflow-y-hidden font-ralewayBold bg-[#d2d8e6] dark:bg-[#1E1D20]">
      <Navbar />
      <div className="flex flex-col justify-center place-items-center p-20 sm:p-0">
        <div className="flex flex-row sm:flex-col-reverse sm:h-screen">
          <div className="flex flex-col items-center justify-center  bg-[#79a3b7] dark:bg-[#BA6767]  w-[500px] h-[600px] rounded-tl-2xl rounded-bl-2xl sm:hidden">
            <WatchLogo />
            <h2 className="font-bold text-5xl text-white dark:text-[#4d2020]">
              Welcome
            </h2>
            <h4 className="font-bold text-2xl text-gray-300 mt-1">
              Analyze all in one place
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#E1E1E1] w-[500px] h-[600px]  p-20 rounded-tr-2xl rounded-br-2xl  sm:w-screen sm:rounded-none sm:h-full sm:p-5">
            <a href="/" className="mb-5 sm:mt-10">
              <img src={logo} className="h-20" alt="Physiobit Logo" />
            </a>
            <h2 className="font-bold text-4xl w-72 mt-5 text-center">
              {" "}
              Login{" "}
            </h2>
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="p-[10px] mt-5 bg-[#373F51] dark:bg-[#BA6767] w-72 rounded-lg cursor-pointer font-bold text-white"
            >
              {" "}
              Login{" "}
            </button>
            <a href="/register" className="mb-auto">
              <p className="mt-5 text-[#696969]"> Haven't started? Register</p>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
