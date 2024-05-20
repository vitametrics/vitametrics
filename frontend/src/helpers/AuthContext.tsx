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
  frontendVersion: string;
  backendVersion: string;
  fetchVersion: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [frontendVersion, setFrontendVersion] = useState<string>("");
  const [backendVersion, setBackendVersion] = useState<string>("");

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
        setIsOwner(response.data.user.role === "owner" ? true : false);
        if (isOwner) {
          await fetchVersion();
        }
        setProjects(response.data.user.projects);
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
      localStorage.setItem("devicesData", JSON.stringify([]));
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    login();
  }, []); // Empty dependency array to run only on mount

  const FETCH_VERSION_ENDPOINT = `${process.env.API_URL}/version"`;

  const fetchVersion = async () => {
    try {
      const response = await axios.get(FETCH_VERSION_ENDPOINT, {
        withCredentials: true,
      });
      console.log(response.data);
      setFrontendVersion(response.data.frontendVersion);
      setBackendVersion(response.data.backendVersion);
    } catch (error) {
      console.error("Error fetching version:", error);
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
        frontendVersion,
        backendVersion,
        fetchVersion,
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
