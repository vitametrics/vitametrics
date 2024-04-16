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

type DataItem = {
  date: string;
  value: number;
};

interface Device {
  id: string;
  deviceVersion: string;
  lastSyncTime: string;
  batteryLevel: number;
  ownerName: string;
  heart: DataItem[];
  steps: DataItem[];
  calories: DataItem[];
  distance: DataItem[];
  elevation: DataItem[];
  floors: DataItem[];
  [key: string]: any; // This line is the index signature
}

const DemoContext = createContext<DemoProps | undefined>(undefined);

const DemoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [startDate, setStartDate] = useState(new Date("2024-02-25")); // use `new Date()` instead of `Date.now()`
  const [rangeStartDate, setRangeStartDate] = useState(new Date("2024-02-25"));
  const [rangeEndDate, setRangeEndDate] = useState(new Date("2024-02-27"));
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "2570612980",
      deviceVersion: "Alta HR",
      lastSyncTime: "2024-02-24T00:02:13.000",
      ownerName: "Brandon Le",
      batteryLevel: 100,
      heart: [
        { date: "2024-02-24", value: 75 },
        { date: "2024-02-25", value: 72 },
        { date: "2024-02-26", value: 80 },
      ],
      steps: [
        { date: "2024-02-24", value: 5000 },
        { date: "2024-02-25", value: 5500 },
        { date: "2024-02-26", value: 6000 },
      ],
      calories: [
        { date: "2024-02-24", value: 250 },
        { date: "2024-02-25", value: 275 },
        { date: "2024-02-26", value: 300 },
      ],
      distance: [
        { date: "2024-02-24", value: 2 },
        { date: "2024-02-25", value: 2.5 },
        { date: "2024-02-26", value: 3 },
      ],
      elevation: [
        { date: "2024-02-24", value: 10 },
        { date: "2024-02-25", value: 12 },
        { date: "2024-02-26", value: 15 },
      ],
      floors: [
        { date: "2024-02-24", value: 5 },
        { date: "2024-02-25", value: 6 },
        { date: "2024-02-26", value: 7 },
      ],
    },
    {
      id: "2570612417",
      deviceVersion: "Fitbit Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      ownerName: "Angel Vazquez",
      batteryLevel: 10,
      heart: [
        { date: "2024-02-24", value: 80 },
        { date: "2024-02-25", value: 85 },
        { date: "2024-02-26", value: 78 },
      ],
      steps: [
        { date: "2024-02-24", value: 7000 },
        { date: "2024-02-25", value: 7500 },
        { date: "2024-02-26", value: 8000 },
      ],
      calories: [
        { date: "2024-02-24", value: 350 },
        { date: "2024-02-25", value: 375 },
        { date: "2024-02-26", value: 400 },
      ],
      distance: [
        { date: "2024-02-24", value: 3 },
        { date: "2024-02-25", value: 3.5 },
        { date: "2024-02-26", value: 4 },
      ],
      elevation: [
        { date: "2024-02-24", value: 15 },
        { date: "2024-02-25", value: 18 },
        { date: "2024-02-26", value: 20 },
      ],
      floors: [
        { date: "2024-02-24", value: 7 },
        { date: "2024-02-25", value: 8 },
        { date: "2024-02-26", value: 9 },
      ],
    },
    {
      id: "2570612987",
      deviceVersion: "Apple Vision Pro",
      lastSyncTime: "2024-02-24T00:02:13.000",
      ownerName: "Sean Cornell",
      batteryLevel: 50,
      heart: [
        { date: "2024-02-24", value: 120 },
        { date: "2024-02-25", value: 100 },
        { date: "2024-02-26", value: 69 },
      ],
      steps: [
        { date: "2024-02-24", value: 1000 },
        { date: "2024-02-25", value: 10000 },
        { date: "2024-02-26", value: 7460 },
      ],
      calories: [
        { date: "2024-02-24", value: 500 },
        { date: "2024-02-25", value: 875 },
        { date: "2024-02-26", value: 320 },
      ],
      distance: [
        { date: "2024-02-24", value: 10 },
        { date: "2024-02-25", value: 4 },
        { date: "2024-02-26", value: 2 },
      ],
      elevation: [
        { date: "2024-02-24", value: 15 },
        { date: "2024-02-25", value: 18 },
        { date: "2024-02-26", value: 20 },
      ],
      floors: [
        { date: "2024-02-24", value: 7 },
        { date: "2024-02-25", value: 8 },
        { date: "2024-02-26", value: 9 },
      ],
    },
    {
      id: "4200612980",
      deviceVersion: "Playstation 5",
      lastSyncTime: "1995-04-24T00:02:43.000",
      ownerName: "Tom ReGoat",
      batteryLevel: 25,
      heart: [
        { date: "2024-02-24", value: 80 },
        { date: "2024-02-25", value: 85 },
        { date: "2024-02-26", value: 78 },
      ],
      steps: [
        { date: "2024-02-24", value: 7000 },
        { date: "2024-02-25", value: 7500 },
        { date: "2024-02-26", value: 8000 },
      ],
      calories: [
        { date: "2024-02-24", value: 350 },
        { date: "2024-02-25", value: 375 },
        { date: "2024-02-26", value: 400 },
      ],
      distance: [
        { date: "2024-02-24", value: 3 },
        { date: "2024-02-25", value: 3.5 },
        { date: "2024-02-26", value: 4 },
      ],
      elevation: [
        { date: "2024-02-24", value: 15 },
        { date: "2024-02-25", value: 18 },
        { date: "2024-02-26", value: 20 },
      ],
      floors: [
        { date: "2024-02-24", value: 7 },
        { date: "2024-02-25", value: 8 },
        { date: "2024-02-26", value: 9 },
      ],
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
