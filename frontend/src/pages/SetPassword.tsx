import { useSearchParams } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";

const SetPassword = () => {
  const [searchParams] = useSearchParams({
    token: "",
  });
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

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!searchParams.has("token")) {
    return <div>Invalid token</div>;
  }

  return (
    <div className="">
      {token ? (
        <Fragment>
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
        </Fragment>
      ) : (
        <div>Invalid token</div>
      )}
    </div>
  );
};

export default SetPassword;
