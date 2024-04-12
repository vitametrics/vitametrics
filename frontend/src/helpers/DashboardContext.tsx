import {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

interface DashboardProps {
  startDate: Date;
  rangeStartDate: Date;
  rangeEndDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setRangeStartDate: Dispatch<SetStateAction<Date>>;
  setRangeEndDate: Dispatch<SetStateAction<Date>>;
  showBackDrop: boolean;
  setShowBackDrop: (arg0: boolean) => void;
}

const DashboardContext = createContext<DashboardProps | undefined>(undefined);

const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [startDate, setStartDate] = useState(new Date()); // use `new Date()` instead of `Date.now()`
  const [rangeStartDate, setRangeStartDate] = useState(new Date()); 
  const [rangeEndDate, setRangeEndDate] = useState(new Date()); 
  const [showBackDrop, setShowBackDrop] = useState(false); 

  return (
    <DashboardContext.Provider
      value={{
        startDate,
        rangeStartDate,
        rangeEndDate,
        setRangeStartDate,
        setStartDate,
        setRangeEndDate,
        showBackDrop,
        setShowBackDrop,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export { DashboardProvider, useDashboard };
