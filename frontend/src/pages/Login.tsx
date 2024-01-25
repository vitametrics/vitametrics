import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import WatchLogo from "../components/Watch";

const Login = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //todos
  //if the user is already authenticated --> send them back to the dashboard
  //if the user is not authenticated --> send them to the login page

  if (authenticated) {
    //send them to the dashboard
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://physiobit.seancornell.io/api/login", {
        email: email,
        password: password,
      });

      console.log(response.data);

      if (response.data.token) {
        setAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex flex-col justify-center place-items-center p-[4.5rem] sm:p-0">
        <div className="flex flex-row sm:flex-col-reverse sm:h-screen">
          <div className="flex flex-col items-center justify-center bg-[#BA6767] w-[500px] h-[600px] rounded-tl-2xl rounded-bl-2xl sm:hidden">
            <WatchLogo />
            <h2 className="font-bold text-5xl text-white">Welcome</h2>
            <h4 className="font-bold text-2xl text-gray-300 mt-1">
              Analyze all in one place
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center bg-white w-[500px] h-[600px]  p-20 rounded-tr-2xl rounded-br-2xl  sm:w-screen sm:rounded-none sm:h-full sm:p-5">
            <h2 className="font-bold text-4xl w-72 text-center"> Login </h2>
            <input
              className="p-[10px] mt-5 w-72 bg-[#e7e6e6]  rounded-lg"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-[10px] mt-5 w-72 bg-[#e7e6e6] border-[#e7e6e6]  rounded-lg"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="p-[10px] mt-5 bg-[#BA6767] w-72 rounded-lg cursor-pointer font-bold text-white"
            >
              {" "}
              Login{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
