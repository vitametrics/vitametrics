import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create AuthContext
interface AuthContextProps {
  isAuthenticated: boolean;
  isAccountLinked: boolean;
  isOrgOwner: boolean;
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

  const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;
  //const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_ENDPOINT; //~ production

  const login = async () => {
    try {
      const response = await axios.get(AUTH_ENDPOINT, {
        withCredentials: true,
      });

      console.log(response.data);
      setIsAuthenticated(response.data.isAuthenticated);
      setIsAccountLinked(response.data.isAccountLinked);
      setIsOrgOwner(response.data.isOrgOwner);
    } catch (error) {
      console.log(error);
    }

    return;
  };

  const logout = () => {
    setIsAuthenticated(false);
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
