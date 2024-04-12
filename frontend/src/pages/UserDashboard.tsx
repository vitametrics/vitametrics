/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardNavbar } from "../components/DashboardNavbar";
import StickySidebar from "../components/StickySidebar";
import { useState, useCallback, useEffect } from "react";
//import {CustomReq} from "../../../backend/util/customReq";
import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Members from "../components/Dashboard-Views/Members";
import Settings from "../components/Dashboard-Views/Settings";
import Footer from "../components/Footer";
import { useAuth } from "../helpers/AuthContext";
import { useNavigate, useParams, Navigate, useSearchParams } from "react-router-dom";
import { DashboardProvider } from "../helpers/DashboardContext";

//import { useOrg } from "../helpers/OrgContext";
//import axios from "axios";

const Dashboard = () => {
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT;
  //const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const { isAccountLinked } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams({view:"data"})
  const view = searchParams.get("view") || "data";

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const setPage = (newView: string) => {
    setSearchParams({ "view": newView }, { replace: true } );
  };
  
  //const [showBackdrop, setShowBackdrop] = useState(false);

  /*
  const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_ENDPOINT;
  const [orgName, setOrgName] = useState("");
  const [devices, setDevices] = useState<any[]>([]); // Initialize devices state with an empty array
  const [members, setMembers] = useState<any[]>([]);
  const { setOrgId } = useOrg();

  const AUTH_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_AUTH_ENDPOINT
      : import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;

  const FETCH_ORG_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_ORG_DEV_ENDPOINT;

  const FETCH_DEVICES_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_DEVICES_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_DEVICES_DEV_ENDPOINT;
*/
  //predefine a list of devices
  /*
  const testDevices = [
    {
      device_id: "1234",
      device_type: "Fitbit",
      last_sync_date: "2021-10-10",
      battery_level: 50,
      steps: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 10000,
        },
        {
          date: "2024-02-22",
          value: 10000,
        },
      ],
      heart_rate: [
        {
          date: "2024-02-20",
          value: 100,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
    },
    {
      device_id: "5678",
      device_type: "Fitbit",
      last_sync_date: "2021-10-10",
      battery_level: 50,
      steps: [
        {
          date: "2024-02-20",
          value: 10000,
        },
        {
          date: "2024-02-21",
          value: 10000,
        },
        {
          date: "2024-02-22",
          value: 10000,
        },
      ],
      heart_rate: [
        {
          date: "2024-02-20",
          value: 100,
        },
        {
          date: "2024-02-21",
          value: 100,
        },
        {
          date: "2024-02-22",
          value: 100,
        },
      ],
    },
  ];

  /*
  useEffect(() => {
    authResponse();
    setDevices(testDevices);
    fetchOrg();
  }, [orgId]);
*/
  /*
  const fetchOrg = async () => {
    try {
      const response = await axios.get(FETCH_ORG_ENDPOINT, {
        params: {
          orgId: orgId,
        },
        withCredentials: true,
      });

      console.log(response.data);
      setOrgName(response.data.organization.orgName);
      console.log(response.data);
      //setDevices(response.data.organization.devices);
      setMembers(response.data.members || []);
      await fetchDevices();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDevices = async () => {
    console.log("fetching devices from " + FETCH_DEVICES_ENDPOINT);
    try {
      const response = await axios.get(FETCH_DEVICES_ENDPOINT, {
        withCredentials: true,
      });

      console.log(response.data);
      setDevices(response.data);
    } catch (error) {
      setDevices(testDevices);
      console.log(error);
    }
  };

  const authResponse = async () => {
    try {
      const auth_response = await axios.get(AUTH_ENDPOINT, {
        withCredentials: true,
      });

      if (auth_response.data.isAuthenticated === false) {
        console.log("User is not authenticated");
        logout();
        window.location.href = "/login";
        return;
      }

      await login();
      setOrgId(auth_response.data.user.orgId);

      console.log(auth_response.data);
    } catch (error) {
      console.log(error);
    }
  };
*/
  const oAuthLogin = async () => {
    window.location.href = "https://physiobit.org/api/auth";
  };

  const renderComponent = useCallback(() => {
    switch (view) {
      case "data":
        return <Data />;
      case "devices":
        return <Devices />;
      case "members":
        return <Members />;
      case "settings":
        return <Settings />;
      default:
        return <Data />;
    }
  }, [view]);

  return (
    <DashboardProvider>
      <div className="h-full font-ralewayBold  bg-[#1E1D20] bg-hero-texture">
        <DashboardNavbar />
        <div className="flex flex-row">
          <div className="w-[125px]">
            <StickySidebar setPage={setPage} path="dashboard" />
          </div>
          <div className="flex w-full h-full flex-col ">
            {!isAccountLinked && (
              <button
                onClick={oAuthLogin}
                className="p-2 text-white bg-[#BA6767] hover:bg-[#8e5252]"
              >
                Authenticate Your Fitbit Account{" "}
              </button>
            )}
            {renderComponent()}
          </div>
        </div>
        <Footer />
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
