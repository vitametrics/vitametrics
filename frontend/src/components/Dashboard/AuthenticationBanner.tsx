import { Fragment } from "react";
import { useProject } from "../../helpers/ProjectContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthenticationBanner = () => {
  const { projectId } = useProject();
  const navigate = useNavigate();

  const oAuthLogin = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_OAUTH_LOGIN_ENDPOINT,
        {
          projectId: projectId,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/api/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <button
        onClick={oAuthLogin}
        className="p-2 text-white bg-red-400 hover:bg-[#8e5252]"
      >
        ALERT: Authenticate Your Fitbit Account{" "}
      </button>
    </Fragment>
  );
};
export default AuthenticationBanner;
