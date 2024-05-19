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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);

  const testProjects = [
    {
      projectId: "1",
      projectName: "Project 1",
      ownerId: "1",
      ownerName: "Owner 1",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "2",
      projectName: "Project 2",
      ownerId: "2",
      ownerName: "Owner 2",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "3",
      projectName: "Project 3",
      ownerId: "3",
      ownerName: "Owner 3",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "4",
      projectName: "Project 4",
      ownerId: "4",
      ownerName: "Owner 4",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "5",
      projectName: "Project 5",
      ownerId: "5",
      ownerName: "Owner 5",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "6",
      projectName: "Project 6",
      ownerId: "6",
      ownerName: "Owner 6",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "7",
      projectName: "Project 7",
      ownerId: "7",
      ownerName: "Owner 7",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "8",
      projectName: "Project 8",
      ownerId: "8",
      ownerName: "Owner 8",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "9",
      projectName: "Project 9",
      ownerId: "9",
      ownerName: "Owner 9",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "10",
      projectName: "Project 10",
      ownerId: "10",
      ownerName: "Owner 10",
      ownerEmail: "",
      members: [],
      devices: [],
    },
    {
      projectId: "11",
      projectName: "Project 11",
      ownerId: "11",
      ownerName: "Owner 11",
      ownerEmail: "",
      members: [],
      devices: [],
    },
  ];

  const AUTH_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_AUTH_ENDPOINT
      : import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;

  const LOGOUT_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_LOGOUT_ENDPOINT
      : import.meta.env.VITE_APP_LOGOUT_DEV_ENDPOINT;

  const LOGIN_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_LOGIN_ENDPOINT
      : import.meta.env.VITE_APP_LOGIN_DEV_ENDPOINT;

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
        setProjects(response.data.user.projects);
      } catch (error) {
        console.log(error);
        setProjects(testProjects);
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
