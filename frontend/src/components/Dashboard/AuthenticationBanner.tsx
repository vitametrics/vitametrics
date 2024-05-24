import { Fragment } from "react";
import { oAuthLogin } from "../../services/projectService";

const AuthenticationBanner = () => {
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
