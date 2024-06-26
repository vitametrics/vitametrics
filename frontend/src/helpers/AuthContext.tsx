import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isAccountLinked: boolean;
  isOrgOwner: boolean;
  isEmailVerified: boolean;
  login: () => void;
  logout: () => void;
  login_from_set_password: (email: string, password: string) => void;
  userEmail: string;
  userId: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isAccountLinked, setIsAccountLinked] = useState<boolean>(false);
  const [isOrgOwner, setIsOrgOwner] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

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
        setIsAccountLinked(response.data.user.isAccountLinked);
        setIsOrgOwner(response.data.user.isOrgOwner);
        setIsEmailVerified(response.data.user.isEmailVerified);
        setUserEmail(response.data.user.email);
        setUserId(response.data.user.id);
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
        isAccountLinked,
        isOrgOwner,
        isEmailVerified,
        login,
        logout,
        login_from_set_password,
        userEmail,
        userId,
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
