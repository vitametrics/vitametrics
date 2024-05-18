import { Fragment } from "react";
import { useProject } from "../../helpers/ProjectContext";
import axios from "axios";

const AuthenticationBanner = () => {
  const { projectId } = useProject();

  const oAuthLogin = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_APP_OAUTH_LOGIN_ENDPOINT + projectId,
        {
          projectId: projectId,
        },
        {
          withCredentials: true,
        }
      );
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
