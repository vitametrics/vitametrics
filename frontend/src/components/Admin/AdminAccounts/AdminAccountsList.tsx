/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import FullBatteryLevel from "../../../assets/FullBatteryLevel";
import LowBatteryLevel from "../../../assets/LowBatteryLevel";
import MediumBatteryLevel from "../../../assets/MediumBatteryLevel";
import { unlinkFitbitAccountFromSite } from "../../../helpers/fitbit";
import { useNavigate } from "react-router-dom";

interface Project {
  projectId: string;
  projectName: string;
  devices: any[];
}

interface Account {
  accessToken: string;
  refreshToken: string;
  lastTokenRefresh: string;
  projects: Project[];
}

interface AccountsListProps {
  accounts: Record<number, [string, Record<string, Account>]>;
  refreshFitbitAccounts: () => void;
}

const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  refreshFitbitAccounts,
}) => {
  const [activeDeviceIds, setActiveDeviceIds] = useState<string[]>([]);
  const handleAccountDeletion = async (fitbitUserId: string) => {
    await unlinkFitbitAccountFromSite(fitbitUserId);
    await refreshFitbitAccounts();
  };
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/project?id=${projectId}&view=overview`);
  };

  const [activeAccountId, setActiveAccountId] = useState("");
  const enableDropdown = (fitbitUserId: string) => {
    if (activeAccountId === fitbitUserId) {
      setActiveAccountId("");
      return;
    }
    setActiveAccountId(fitbitUserId);
  };

  const handleDeviceClick = (deviceId: string) => {
    setActiveDeviceIds((prevState) => {
      if (prevState.includes(deviceId)) {
        return prevState.filter((id) => id !== deviceId);
      }
      return [...prevState, deviceId];
    });
  };

  const getAssociatedProjects = (projects: Project[], deviceId: string) => {
    return projects.filter((project) =>
      project.devices.some((device) => device.deviceId === deviceId)
    );
  };

  const truncate = (str: string, n: number) => {
    return str.length > n ? str.substr(0, n - 1) : str;
  };

  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-4 w-full  text-primary items-center font-bold"
      >
        <button className="py-2 text-left text-lg">USERID</button>
        <button className="py-2 text-left text-lg">LAST REFRESHED</button>
        <button className="py-2 text-left text-lg">ACCESS TOKEN </button>
        <button className="py-2 text-left text-lg">REFRESH TOKEN</button>
      </div>

      {Object.entries(accounts).map(([_, [dummyValue, fitbitUserIdDict]]) => {
        const fitbitUserId = Object.keys(fitbitUserIdDict)[0];
        const account = fitbitUserIdDict[fitbitUserId];

        return (
          <Fragment key={fitbitUserId}>
            <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
            <div
              className="grid grid-cols-4 w-full items-center text-left py-2 hover:cursor-pointer"
              onClick={() => enableDropdown(fitbitUserId)}
            >
              <span className="text-primary">{fitbitUserId}</span>

              <span className="text-primary">{account?.lastTokenRefresh}</span>
              <span className="text-primary flex items-center">
                {truncate(account?.accessToken, 10) + "**********"}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(account.accessToken);
                  }}
                  className="ml-2"
                >
                  <FontAwesomeIcon icon={faClipboard} />
                </button>
              </span>
              <span className="text-primary flex items-center">
                {truncate(account.refreshToken, 10) + "**********"}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(account.refreshToken);
                  }}
                  className="ml-2"
                >
                  <FontAwesomeIcon icon={faClipboard} />
                </button>
              </span>
            </div>
            <div
              className={`collapsible-content ${
                fitbitUserId === activeAccountId ? "expanded" : ""
              }`}
            >
              {fitbitUserId === activeAccountId && (
                <div className="py-4 bg-white">
                  {account.projects.map((project: Project) => (
                    <div key={project.projectId} className="mb-4">
                      <div className="bg-white rounded-lg">
                        <p className="font-bold text-secondary mb-3 text-lg">
                          Devices linked with {fitbitUserId}
                        </p>
                        {project.devices.length === 0 && (
                          <div className="text-primary">No devices linked</div>
                        )}
                        {project.devices.map((device: any) => (
                          <div
                            key={device.deviceId}
                            className="rounded-lg shadow-sm border-2 hover:cursor-pointer bg-white border-gray-300 mb-3 px-2 dropdown"
                            onClick={() => handleDeviceClick(device.deviceId)}
                          >
                            <div className="py-3 grid grid-cols-4 items-center hover:bg-slate-100 px-2">
                              <div className="flex gap-3 items-center text-primary">
                                <span className="border border-gray-300 rounded-lg bg-transparent p-4"></span>
                                {device.deviceVersion}
                              </div>
                              <div className="flex flex-row">
                                <p className="text-primary gap-4">
                                  ID: {device.deviceId}
                                </p>
                              </div>
                              <div className="text-primary">
                                Last Synced: {device.lastSyncTime}
                              </div>
                              <div className="text-primary flex gap-1">
                                {device.batteryLevel}%
                                {parseInt(device.batteryLevel) >= 70 ? (
                                  <FullBatteryLevel />
                                ) : parseInt(device.batteryLevel) >= 30 ? (
                                  <MediumBatteryLevel />
                                ) : (
                                  <LowBatteryLevel />
                                )}
                              </div>
                            </div>
                            <div
                              className={`collapsible-content ${
                                activeDeviceIds.includes(device.deviceId)
                                  ? "expanded"
                                  : ""
                              }`}
                            >
                              <div className="w-full px-2 mb-5">
                                <hr className="w-full bg-gray-500" />
                                <div className="flex-col flex mt-3">
                                  <p className="text-primary text-lg mb-3">
                                    Associated Projects
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleProjectClick(device.projectId)
                                    }
                                    className="text-primary p-2 border-2 shadow-md border-gray-300 hover:bg-gray-200 rounded-lg w-[200px]"
                                  >
                                    {getAssociatedProjects(
                                      account.projects,
                                      device.deviceId
                                    ).map((project) => project.projectName)}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 bg-white">
                    <button
                      onClick={() => handleAccountDeletion(fitbitUserId)}
                      className="p-2 shadow-lg font-bold w-[100px] bg-tertiary hover:bg-hoverTertiary mt-2 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        );
      })}

      {accounts && Object.keys(accounts).length === 0 && (
        <div className="text-primary">No results found</div>
      )}
    </Fragment>
  );
};

export default AccountsList;
