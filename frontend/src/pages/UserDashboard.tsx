/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "../components/Navbar";
import StickySidebar from "../components/StickySidebar";
import { useState, useEffect, useCallback } from "react";

import Data from "../components/Dashboard-Views/Data";
import Devices from "../components/Dashboard-Views/Devices";
import Members from "../components/Dashboard-Views/Members";
import Settings from "../components/Dashboard-Views/Settings";
import Footer from "../components/Footer";
import { useAuth } from "../helpers/AuthContext";
import axios from "axios";

const Dashboard = () => {
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT;
  //const { isAuthenticated } = useAuth();

  const [page, setPage] = useState("Data");
  const [showBackdrop, setShowBackdrop] = useState(false);

  //const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_ENDPOINT;
  const [orgId, setOrgId] = useState("");
  const [orgName, setOrgName] = useState("");
  const [devices, setDevices] = useState<any[]>([]); // Initialize devices state with an empty array
  const [members, setMembers] = useState<any[]>([]);

  const { login, logout } = useAuth();

  const AUTH_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_AUTH_ENDPOINT
      : import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;

  const FETCH_ORG_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_ORG_DEV_ENDPOINT;

  useEffect(() => {
    authResponse();
    fetchOrg();
  }, [orgId]);

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
      setDevices(
        response.data.organization.devices || [
          { owner: "brandon", type: "luxe", status: "50%" },
        ]
      );
      setMembers(response.data.members || []);
    } catch (error) {
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

      login();
      setOrgId(auth_response.data.user.orgId);

      console.log(auth_response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const oAuthLogin = async () => {
    window.location.href = "https://physiobit.org/api/auth";
  };

  const renderComponent = useCallback(() => {
    switch (page) {
      case "Data":
        return <Data orgName={orgName} devices={devices} />;
      case "Devices":
        return <Devices orgName={orgName} devices={devices} />;
      case "Members":
        return <Members orgName={orgName} members={members} />;
      case "Settings":
        return <Settings />;
      default:
        return <Data orgName={orgName} devices={devices} />;
    }
  }, [page, orgId, orgName, devices, members]); // Only recompute if `page` changes

  return (
    <div className="h-full font-ralewayBold">
      {showBackdrop && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
          onClick={() => setShowBackdrop(false)} // Close the backdrop when clicked
        />
      )}
      <Navbar />
      <div className="flex flex-row">
        <div className="w-[150px]">
          <StickySidebar setPage={setPage} />
        </div>
        <div className="flex w-full h-full flex-col">
          <button onClick={oAuthLogin} className="p-2 bg-red">
            Authenticate Your Fitbit Account{" "}
          </button>

          {renderComponent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
