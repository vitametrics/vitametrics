import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import WatchLogo from "../components/Watch";
import logo from "../assets/images/logo.png";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  //todos
  //if the user is already authenticated --> send them back to the dashboard
  //if the user is not authenticated --> send them to the login page

  const handleRegister = async () => {
    if (password != confirmPassword) {
      console.log("Passwords do not match");
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7970/api/register", {
        email: email,
        password: password,
        inviteCode: inviteCode,
      });

      if (response.status === 200) {
        setMessage("Success");
        console.log("Message sent successfully");
      }

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full font-ralewayBold bg-[#d2d8e6] dark:bg-[#1E1D20] ">
      <Navbar />
      <div className="flex flex-col justify-center place-items-center p-[4.5rem] sm:p-0">
        <div className="flex flex-row sm:flex-col-reverse sm:h-screen">
          <div className="flex flex-col items-center justify-center bg-[#79a3b7] dark:bg-[#BA6767] w-[500px] h-[600px] rounded-tl-2xl rounded-bl-2xl sm:hidden p-20">
            <WatchLogo />
            <h2 className="font-bold text-5xl text-white dark:text-[#4d2020]">
              Register
            </h2>
            <h4 className="font-bold text-2xl text-gray-300 mt-3 text-center">
              Your next destination for research and analysis
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center bg-white w-[500px] h-[600px]  p-20 rounded-tr-2xl rounded-br-2xl  sm:w-screen sm:rounded-none sm:h-full sm:p-5">
            <img src={logo} className="h-16 mb-5" alt="Physiobit Logo" />

            <h2 className="font-bold text-4xl w-72 text-center"> Register </h2>
            {message != "Success" ? (
              <p className="text-red-500 mt-5 font-bold">{message}</p>
            ) : (
              <p className="text-green-500 mt-5 font-bold">{message}</p>
            )}
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1]  text-black rounded-lg"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black rounded-lg"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black rounded-lg"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
              type="text"
              placeholder="Invite Code"
              onChange={(e) => setInviteCode(e.target.value)}
            />

            <button
              onClick={handleRegister}
              className="p-[10px] mt-5  bg-[#373F51] dark:bg-[#BA6767] w-72 rounded-lg cursor-pointer font-bold text-white"
            >
              Register
            </button>
            <a href="/contact">
              <p className="mt-5 text-[#696969]">
                {" "}
                Need an account? Contact us!
              </p>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
