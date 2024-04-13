import {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

interface DemoProps {
  startDate: Date;
  rangeStartDate: Date;
  rangeEndDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setRangeStartDate: Dispatch<SetStateAction<Date>>;
  setRangeEndDate: Dispatch<SetStateAction<Date>>;
  showBackDrop: boolean;
  setShowBackDrop: (arg0: boolean) => void;
  devices: Device[];
  setDevices: Dispatch<SetStateAction<Device[]>>;
}

interface Device {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  ownerName: string;
}

const DemoContext = createContext<DemoProps | undefined>(undefined);

const DemoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [startDate, setStartDate] = useState(new Date()); // use `new Date()` instead of `Date.now()`
  const [rangeStartDate, setRangeStartDate] = useState(new Date());
  const [rangeEndDate, setRangeEndDate] = useState(new Date());
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "2570612980",
      deviceVersion: "Alta HR",
      lastSyncTime: "2024-02-24T00:02:13.000",
      ownerName: "Brandon Le",
      batteryLevel: 100,
    },
    {
      id: "2570612417",
      deviceVersion: "Fitbit Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      ownerName: "Angel Vazquez",
      batteryLevel: 10,
    },
    {
      id: "2570612987",
      deviceVersion: "Apple Vision Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      ownerName: "Sean Cornell",
      batteryLevel: 50,
    },
    {
      id: "4200612980",
      deviceVersion: "Playstation 5",
      lastSyncTime: "1995-04-24T00:02:43.000",
      ownerName: "Tom ReGoat",
      batteryLevel: 25,
    },
  ]);

  return (
    <DemoContext.Provider
      value={{
        startDate,
        rangeStartDate,
        rangeEndDate,
        setRangeStartDate,
        setStartDate,
        setRangeEndDate,
        showBackDrop,
        setShowBackDrop,
        devices,
        setDevices,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
};

export { DemoProvider, useDemo };
