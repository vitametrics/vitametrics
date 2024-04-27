import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.webp";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const REGISTER_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_REGISTER_ENDPOINT
      : import.meta.env.VITE_APP_REGISTER_DEV_ENDPOINT;

  const handleRegister = async () => {
    if (password != confirmPassword) {
      console.log("Passwords do not match");
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(REGISTER_ENDPOINT, {
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="180"
              height="200"
              fill="none"
              viewBox="0 0 191 235"
              className="pt-[10px] pb-[10px] mb-5"
            >
              <path
                fill="#ffff"
                d="M182.318 94h-8.682V62.667c0-12.925-11.72-23.5-26.045-23.5H26.046C11.72 39.167 0 49.742 0 62.667v109.666c0 12.925 11.72 23.5 26.046 23.5H147.59c14.325 0 26.045-10.575 26.045-23.5V141h8.682c4.794 0 8.682-3.504 8.682-7.833v-31.334c0-4.33-3.888-7.833-8.682-7.833Zm-43.409 23.5h-20.663l-23.701 42.692c-1.476 2.663-4.428 4.308-7.727 4.308-.347 0-.781 0-1.129-.078-3.733-.47-6.684-2.899-7.379-6.189L66.676 105.75l-6.511 14.648c-1.302 2.977-4.514 4.935-8.074 4.935H34.727c-4.775 0-8.681-3.525-8.681-7.833s3.906-7.833 8.681-7.833h11.46l15.194-34.232c1.475-3.212 5.035-5.248 8.855-4.935 3.82.313 6.945 2.898 7.727 6.267l12.415 56.008 14.759-26.633c1.389-2.664 4.428-4.309 7.727-4.309h26.045c4.775 0 8.682 3.525 8.682 7.834 0 4.308-3.907 7.833-8.682 7.833Z"
              />
              <path
                fill="#fff"
                d="M116.163 23.5h17.711l-3.82-17.233C129.272 2.663 125.713 0 121.545 0H52.091c-4.167 0-7.727 2.663-8.508 6.267L39.763 23.5h76.4Zm-58.689 188H39.763l3.82 17.233c.781 3.604 4.34 6.267 8.508 6.267h69.454c4.168 0 7.727-2.663 8.509-6.267l3.82-17.233H57.473Z"
              />
            </svg>{" "}
            <h2 className="font-bold text-5xl text-white dark:text-[#4d2020]">
              Register
            </h2>
            <h4 className="font-bold text-2xl text-gray-300 mt-3 text-center">
              Your next destination for research and analysis
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center bg-white w-[500px] h-[600px]  p-20 rounded-tr-2xl rounded-br-2xl  sm:w-screen sm:rounded-none sm:h-full sm:p-5">
            <img src={logo} className="h-16 mb-5" alt="vitametrics Logo" />

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
