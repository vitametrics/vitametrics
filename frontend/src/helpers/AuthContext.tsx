/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isEmailVerified: boolean;
  login: () => void;
  logout: () => void;
  login_from_set_password: (email: string, password: string) => void;
  userEmail: string;
  userId: string;
  isOwner: boolean;
  projects: any[];
  setProjects: (auth0: any[]) => void;
  latestVersion: string;
  currVersion: string;
  isUpToDate: boolean;
  fetchVersion: () => void;
  userRole: string;
  isAdmin: boolean;
  setUserRole: (auth0: string) => void;
  health: boolean;
  fetchSiteMembers: () => void;
  siteMembers: any[];
  showBackDrop: boolean;
  setShowBackDrop: (auth0: boolean) => void;
  setSiteMembers: (auth0: any[]) => void;
  fetchInstanceProjects: () => void;
  siteAccounts: any;
  fetchSiteAccounts: () => void;
  siteProjects: any;
  setSiteProjects: (auth0: any[]) => void;
  fetchUserProjects: () => void;
}

interface Project {
  projectId: string;
  projectName: string;
  deviceCount: number;
  memberCount: number;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const AUTH_ENDPOINT = `${process.env.API_URL}/user/auth/status`;
  const LOGOUT_ENDPOINT = `${process.env.API_URL}/logout`;
  const LOGIN_ENDPOINT = `${process.env.API_URL}/login`;
  const FETCH_VERSION_ENDPOINT = `${process.env.API_URL}/version`;
  const FETCH_HEALTH_ENDPOINT = `${process.env.API_URL}/health`;
  const FETCH_SITE_MEMBERS_ENDPOINT = `${process.env.API_URL}/owner/users`;
  const FETCH_INSTANCE_PROJECTS_ENDPOINT = `${process.env.API_URL}/owner/projects`;
  const FETCH_INSTANCE_ACCOUNTS_ENDPOINT = `${process.env.API_URL}/owner/fitbit`;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("" as string);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currVersion, setCurrVersion] = useState<string>("");
  const [latestVersion, setLatestVersion] = useState<string>("");
  const [isUpToDate, setIsUpToDate] = useState<boolean>(false);
  const [health, setHealth] = useState(false);
  const [siteMembers, setSiteMembers] = useState<any[]>([]);
  const [siteAccounts, setSiteAccounts] = useState<any[]>([]);
  const [siteProjects, setSiteProjects] = useState<any[]>([]);

  const [showBackDrop, setShowBackDrop] = useState(false);

  const login = async () => {
    if (!isAuthenticated) {
      try {
        const response = await axios.get(AUTH_ENDPOINT, {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuthenticated);
        setIsEmailVerified(response.data.user.isEmailVerified);
        setUserEmail(response.data.user.email);
        setUserId(response.data.user.id);
        setIsOwner(response.data.user.role === "siteOwner");
        setIsAdmin(response.data.user.role === "siteAdmin");
        setUserRole(response.data.user.role);

        if (isOwner || isAdmin) {
          await fetchVersion();
          await fetchHealth();
          await fetchSiteMembers();
          await fetchSiteAccounts();
        }

        setProjects(response.data.user.projects);
        await fetchInstanceProjects();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    return;
  };

  const login_from_set_password = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        LOGIN_ENDPOINT,
        { email: email, password: password },
        { withCredentials: true }
      );

      if (response.data) {
        login();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await axios.get(LOGOUT_ENDPOINT, {
        withCredentials: true,
      });
      localStorage.setItem("devices", JSON.stringify([]));

      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  const fetchVersion = async () => {
    try {
      const response = await axios.get(FETCH_VERSION_ENDPOINT, {
        withCredentials: true,
      });
      setCurrVersion(response.data.siteVersion);
      setIsUpToDate(response.data.isUpToDate);
      setLatestVersion(response.data.latestVersion);
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  };

  const fetchHealth = async () => {
    try {
      await axios.get(FETCH_HEALTH_ENDPOINT, {
        withCredentials: true,
      });
    } catch (error) {
      setHealth(false);
      console.error("Error fetching health:", error);
    }
  };

  const fetchSiteMembers = async () => {
    try {
      const response = await axios.get(FETCH_SITE_MEMBERS_ENDPOINT, {
        withCredentials: true,
      });
      setSiteMembers(response.data);
    } catch (error) {
      console.error("Error fetching site members:", error);
    }
  };

  const fetchSiteAccounts = async () => {
    try {
      const response = await axios.get(FETCH_INSTANCE_ACCOUNTS_ENDPOINT, {
        withCredentials: true,
      });
      setSiteAccounts(response.data);
    } catch (error) {
      console.error("Error fetching site members:", error);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await axios.get(AUTH_ENDPOINT, {
        withCredentials: true,
      });

      setProjects(response.data.user.projects);
    } catch (error) {
      console.error("Error fetching site members:", error);
    }
  };

  const fetchInstanceProjects = async () => {
    try {
      const response = await axios.get(FETCH_INSTANCE_PROJECTS_ENDPOINT, {
        withCredentials: true,
      });

      setSiteProjects(response.data);
    } catch (error) {
      console.error("Error fetching site members:", error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingAuth,
        isEmailVerified,
        login,
        logout,
        login_from_set_password,
        userEmail,
        userId,
        isOwner,
        projects,
        setProjects,
        currVersion,
        latestVersion,
        isUpToDate,
        fetchVersion,
        userRole,
        isAdmin,
        setUserRole,
        health,
        fetchSiteMembers,
        siteMembers,
        setSiteMembers,
        showBackDrop,
        setShowBackDrop,
        siteProjects,
        fetchInstanceProjects,
        siteAccounts,
        fetchSiteAccounts,
        fetchUserProjects,
        setSiteProjects,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook for consuming AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
