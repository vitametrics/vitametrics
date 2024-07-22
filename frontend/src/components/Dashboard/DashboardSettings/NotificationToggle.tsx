import { useState, useEffect, Fragment } from "react";
import { useProject } from "../../../helpers/ProjectContext";
import axios from "axios";

const TOGGLE_NOTIFICATION_ENDPOINT = `${process.env.API_URL}/project/toggle-notifications`;

const NotificationToggle = () => {
  const { project, updateProject } = useProject();
  const [msg, setMsg] = useState("");
  const [flag, setFlag] = useState(false);
  const [isEnabled, setIsEnabled] = useState(
    project.areNotificationsEnabled ?? false
  );

  useEffect(() => {
    setIsEnabled(project.areNotificationsEnabled);
  }, [project.areNotificationsEnabled]);

  const handleToggle = async () => {
    try {
      const response = await axios.put(TOGGLE_NOTIFICATION_ENDPOINT, {
        withCredentials: true,
      });

      updateProject({
        areNotificationsEnabled: response.data.areNotificationsEnabled,
      });
      setIsEnabled(response.data.areNotificationsEnabled);
      setMsg(response.data.msg);
      setFlag(true);
    } catch (error) {
      setFlag(false);
      setMsg("Error updating notification settings");
      console.error("Error updating notification settings");
    }
  };

  return (
    <Fragment>
      {flag ? (
        <span className="text-green-500">{msg}</span>
      ) : (
        <span className="text-red-500">{msg}</span>
      )}
      <div className="switch">
        <input
          id="toggle-btn"
          className="toggle"
          type="checkbox"
          checked={isEnabled}
          onChange={handleToggle}
        />
        <label htmlFor="toggle-btn"></label>
      </div>
    </Fragment>
  );
};

export default NotificationToggle;
