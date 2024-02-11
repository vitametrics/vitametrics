import React, { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const userId = sessionStorage.getItem("userId");

  const login = () => {
    const userIdExists = sessionStorage.getItem("userId");

    console.log(userIdExists);

    if (userIdExists) {
      setIsAuthenticated(true);
      console.log("Authenticated!");
      console.log(isAuthenticated);
      window.location.href = "/dashboard?view=data";
    }

    return;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const userIdExists = sessionStorage.getItem("userId");

    if (userIdExists) {
      setIsAuthenticated(true);
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
