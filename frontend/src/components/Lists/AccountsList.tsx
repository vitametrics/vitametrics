/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import FullBatteryLevel from "../../assets/FullBatteryLevel";
import LowBatteryLevel from "../../assets/LowBatteryLevel";
import MediumBatteryLevel from "../../assets/MediumBatteryLevel";
import { unlinkFitbitAccount } from "../../hooks/fitbit";
import { truncate } from "../../hooks/truncate";
import { fetchFBAccounts } from "../../hooks/projectServices";
interface AccountsListProps {
  accounts: any;
  onClick: (arg0: string) => void;
  activeAccountId: string;
}

interface Account {
  userId: string;
  lastTokenRefresh: string;
  accessToken: string;
  refreshToken: string;
  devices: any[];
}

const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  onClick,
  activeAccountId,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("id") || "";

  const handleDeviceClick = (deviceId: string) => {
    setSearchParams(
      { id: projectId, view: "device", device: deviceId },
      { replace: true }
    );
  };

  const handleUnlinkFitbitAccount = async (userId: string) => {
    try {
      await unlinkFitbitAccount(userId);
      await fetchFBAccounts(projectId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <div
        id="options"
        className="grid grid-cols-4 w-full text-primary bg-white items-center font-bold"
      >
        <button className="py-2 text-left ">USERID</button>
        <button className="py-2 text-left">LAST REFRESHED</button>
        <button className="py-2 text-left">ACCESS TOKEN </button>
        <button className="py-2 text-left">REFRESH TOKEN</button>
      </div>

      {accounts?.map((account: Account) => (
        <Fragment>
          <span className="h-[0.5px] bg-[#d3d7df] w-full"></span>
          <div
            className="grid grid-cols-4 w-full items-center text-left py-2 hover:cursor-pointer"
            onClick={() => onClick(account.userId)}
          >
            <span className="text-primary">{account.userId}</span>
            <span className="text-primary">{account.lastTokenRefresh}</span>
            <span className="text-primary flex items-center">
              {truncate(account.accessToken, 10) + "**********"}
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
              account.userId === activeAccountId ? "expanded" : ""
            }`}
          >
            {account.userId === activeAccountId && (
              <div className="py-4 bg-white">
                <p className="font-bold text-primary mb-3">
                  Devices linked with {account.userId}
                </p>
                {account.devices?.length === 0 && (
                  <div className="text-primary">No devices linked</div>
                )}
                {account.devices.map((device: any) => (
                  <div
                    onClick={() => handleDeviceClick(device.deviceId)}
                    key={device.deviceId}
                    className="py-3 grid grid-cols-4  items-center mb-3 hover:bg-slate-100 px-2 rounded-lg hover:cursor-pointer border border-gray-300"
                  >
                    <div className="flex gap-3 items-center">
                      <span className="border border-gray-300 rounded-lg bg-transparent  p-4"></span>
                      {device.deviceVersion}
                    </div>

                    <div className="flex flex-row">
                      <div className="text-primary">ID:</div>
                      <div className="">{device.deviceId}</div>
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
                ))}
                <button
                  onClick={() => handleUnlinkFitbitAccount(account.userId)}
                  className="p-2 font-bold w-[100px] bg-red-400 mt-2 text-white rounded-lg"
                >
                  Unlink
                </button>
              </div>
            )}
          </div>
        </Fragment>
      ))}
      {accounts && accounts?.length === 0 && (
        <div className="text-primary">No results found</div>
      )}
    </Fragment>
  );
};

export default AccountsList;
