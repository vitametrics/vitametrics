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

  const { login, logout, isAccountLinked } = useAuth();

  const AUTH_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_AUTH_ENDPOINT
      : import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;

  const FETCH_ORG_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT
      : import.meta.env.VITE_APP_FETCH_ORG_DEV_ENDPOINT;

  const SYNC_DEVICE_ENDPOINT = import.meta.env.VITE_APP_SYNC_DEVICE_ENDPOINT;

  const FETCH_DEVICE_DATA_ENDPOINT = import.meta.env
    .VITE_APP_FETCH_DEVICE_DATA_ENDPOINT;

  const FETCH_DEVICES_ENDPOINT = import.meta.env
    .VITE_APP_FETCH_DEVICES_ENDPOINT;

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

  const oAuthLogin = async () => {
    window.location.href = "https://physiobit.org/api/auth";
  };

  const syncDevice = async (deviceId: string) => {
    try {
      const response = await axios.get(`${SYNC_DEVICE_ENDPOINT}/${deviceId}`, {
        withCredentials: true,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataById = async (
    id: string,
    startDate: string,
    endDate: string
  ) => {
    if (!id) {
      return console.error("Device ID is required");
    }

    if (!startDate) {
      startDate = Date.now().toString();
    }

    if (!endDate) {
      endDate = Date.now().toString();
    }

    const url = `${FETCH_DEVICE_DATA_ENDPOINT}/${id}`;

    try {
      const response = await axios.get(url, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
        withCredentials: true,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderComponent = useCallback(() => {
    switch (page) {
      case "Data":
        return (
          <Data
            orgName={orgName}
            devices={devices}
            fetchDevice={fetchDataById}
          />
        );
      case "Devices":
        return (
          <Devices
            orgName={orgName}
            devices={devices}
            syncDevices={syncDevice}
          />
        );
      case "Members":
        return <Members orgName={orgName} members={members} />;
      case "Settings":
        return <Settings />;
      default:
        return (
          <Data
            orgName={orgName}
            devices={devices}
            fetchDevice={fetchDataById}
          />
        );
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
        <div className="flex w-full h-full flex-col ">
          {!isAccountLinked ? (
            <button
              onClick={oAuthLogin}
              className="p-2 text-white bg-[#BA6767] hover:bg-[#8e5252]"
            >
              Authenticate Your Fitbit Account{" "}
            </button>
          ) : (
            <></>
          )}

          {renderComponent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
