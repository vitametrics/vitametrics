import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../helpers/AuthContext";
import logo from "../assets/images/vitamix.webp";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SetPassword = () => {
  const SET_PASSWORD_ENDPOINT = `${process.env.API_URL}/user/set-password`;
  const CHECK_PASSWORD_TOKEN_ENDPOINT = `${process.env.API_URL}/user/check-password-token`;

  const [searchParams] = useSearchParams({
    token: "",
    projectId: "",
  });

  const navigate = useNavigate();
  const { login_from_set_password } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const [debouncedConfirmPassword, setDebouncedConfirmPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const response = await axios.post(
        SET_PASSWORD_ENDPOINT,
        {
          password: debouncedPassword,
          token: searchParams.get("token"),
        },
        {
          params: {
            projectId: searchParams.get("projectId"),
          },
        }
      );

      if (response.data) {
        login_from_set_password(response.data.email, debouncedPassword);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full bg-fixed overflow-y-hidden font-neueHassUnica ">
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
              <div className="relative mt-5 w-72">
                <input
                  className="p-[10px] bg-[#d2d1d1] text-black rounded-lg border-[#6d6c6c] w-full"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="icon-cog"
                  />
                </button>
              </div>
              <div className="relative mt-5 w-72">
                <input
                  className="p-[10px] bg-[#d2d1d1] text-black rounded-lg border-[#6d6c6c] w-full"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className="icon-cog"
                  />
                </button>
              </div>
              <button
                onClick={handleSubmit}
                className="p-[10px] mt-5 bg-secondary w-72 rounded-lg cursor-pointer font-bold text-white hover:bg-hoverSecondary"
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
    </div>
  );
};

export default SetPassword;
