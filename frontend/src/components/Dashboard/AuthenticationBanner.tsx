import { Fragment } from "react";
import { useProject } from "../../helpers/ProjectContext";

const AuthenticationBanner = () => {
  const { projectId } = useProject();
  const oAuthLogin = async () => {
    window.location.href = `https://vitametrics.org/api/auth?projectId=${projectId}`;
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
