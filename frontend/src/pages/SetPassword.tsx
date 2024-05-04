import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../helpers/AuthContext";

const SetPassword = () => {
  const [searchParams] = useSearchParams({
    token: "",
  });
  const { login_from_set_password } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const [debouncedConfirmPassword, setDebouncedConfirmPassword] = useState("");
  const token = searchParams.get("token");
  const SET_PASSWORD_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_SET_PASSWORD_ENDPOINT
      : import.meta.env.VITE_APP_SET_PASSWORD_DEV_ENDPOINT;

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
    <div className="bg-fixed w-full h-full">
      <Navbar />
      {token ? (
        <div className="bg-glass">
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <div>Invalid token</div>
      )}
    </div>
  );
};

export default SetPassword;
