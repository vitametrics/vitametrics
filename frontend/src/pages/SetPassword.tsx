import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useAuth } from "../helpers/AuthContext";
import logo from "../assets/images/vitamix.webp";

const SetPassword = () => {
  const [searchParams] = useSearchParams({
    token: "",
  });

  const navigate = useNavigate();

  const { login_from_set_password } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const [debouncedConfirmPassword, setDebouncedConfirmPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const SET_PASSWORD_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_SET_PASSWORD_ENDPOINT
      : import.meta.env.VITE_APP_SET_PASSWORD_DEV_ENDPOINT;

  const CHECK_PASSWORD_TOKEN_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_CHECK_PASSWORD_TOKEN_ENDPOINT
      : import.meta.env.VITE_APP_CHECK_PASSWORD_TOKEN_DEV_ENDPOINT;

  const check_password = async () => {
    try {
      const response = await axios.post(CHECK_PASSWORD_TOKEN_ENDPOINT, {
        token: searchParams.get("token"),
      });

      if (response.data) {
        setIsTokenValid(true);
        return;
      }
    } catch (error) {
      console.log(error);
      setIsTokenValid(false);
    }
  };

  useEffect(() => {
    check_password();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPassword(password);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [password]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedConfirmPassword(confirmPassword);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [confirmPassword]);

  const handleSubmit = async () => {
    if (!debouncedPassword || !debouncedConfirmPassword) {
      console.log("passwords cannot be empty");
      return;
    }

    if (debouncedPassword !== debouncedConfirmPassword) {
      console.log("passwords do not match");
      return;
    }

    try {
      const response = await axios.post(SET_PASSWORD_ENDPOINT, {
        password: debouncedPassword,
        token: searchParams.get("token"),
      });

      if (response.data) {
        login_from_set_password(response.data.email, debouncedPassword);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full bg-fixed overflow-y-hidden font-leagueSpartanBold ">
      <Navbar />
      <div className="flex flex-col justify-center items-center p-0 md:p-10">
        <div className="flex flex-row h-screen items-center justify-center">
          {isTokenValid ? (
            <div className="flex flex-col pt-32 items-center justify-center bg-glass w-full h-full md:w-[500px] md:h-[600px]  p-20 md:pt-20 rounded-none md:rounded-xl ">
              <a href="/" className="mb-5">
                <img
                  src={logo}
                  onClick={() => navigate("/")}
                  className="h-20 rounded-xl border-primary"
                  alt="VitametricsLogo"
                />
              </a>
              <h2 className="font-bold text-4xl w-72 mt-5 text-center text-primary">
                {" "}
                Set Password{" "}
              </h2>
              <input
                className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
                type="password"
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="p-[10px] mt-5 bg-secondary w-72 rounded-lg cursor-pointer font-bold text-white"
              >
                {" "}
                Login{" "}
              </button>
            </div>
          ) : (
            <div className="flex flex-col pt-32 items-center justify-center bg-glass w-full h-full md:w-[500px] md:h-[600px]  p-20 md:pt-20 rounded-none md:rounded-xl text-2xl">
              <a href="/" className="mb-32">
                <img
                  src={logo}
                  onClick={() => navigate("/")}
                  className="h-20 rounded-xl border-primary"
                  alt="VitametricsLogo"
                />
              </a>

              <a className="mb-auto">Invalid token</a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SetPassword;
