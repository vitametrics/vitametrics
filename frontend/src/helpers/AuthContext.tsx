import React, { createContext, useContext, useState, useEffect } from "react";
//import { useOrg } from "./OrgContext";
import axios from "axios";

interface AuthContextProps {
  isAuthenticated: boolean;
  isAccountLinked: boolean;
  isOrgOwner: boolean;
  isEmailVerified: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAccountLinked, setIsAccountLinked] = useState<boolean>(false);
  const [isOrgOwner, setIsOrgOwner] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  //const { setOrgId } = useOrg();

  const AUTH_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_AUTH_ENDPOINT
      : import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;

  const LOGOUT_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_LOGOUT_ENDPOINT
      : import.meta.env.VITE_APP_LOGOUT_DEV_ENDPOINT;

  //const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_ENDPOINT; //~ production

  const login = async () => {
    try {
      const response = await axios.get(AUTH_ENDPOINT, {
        withCredentials: true,
      });

      console.log(response.data);
      setIsAuthenticated(response.data.isAuthenticated);
      setIsAccountLinked(response.data.user.isAccountLinked);
      setIsOrgOwner(response.data.user.isOrgOwner);
      setIsEmailVerified(response.data.user.isEmailVerified);
      //setOrgId(response.data.user.orgId);
    } catch (error) {
      console.log(error);
    }

    return;
  };

  const logout = async () => {
    try {
      const response = await axios.get(LOGOUT_ENDPOINT, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAccountLinked,
        isOrgOwner,
        isEmailVerified,
        login,
        logout,
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
