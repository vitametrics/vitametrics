import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext<NotificationProps | undefined>(
  undefined
);
interface NotificationProps {
  message: string;
  setMessage: (arg0: string) => void;
  success: boolean;
  setSuccess: (arg0: boolean) => void;
}

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  return (
    <NotificationContext.Provider
      value={{
        message,
        setMessage,
        success,
        setSuccess,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within an AuthProvider");
  }

  return context;
};

export { NotificationProvider, useNotification };
