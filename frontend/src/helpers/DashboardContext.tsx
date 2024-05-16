/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useContext,
  createContext,
  useEffect,
  //useRef,
} from "react";
import axios from "axios";

//import { useOrg } from "./OrgContext";

interface DashboardProps {
  projects: any[];
}

/*
interface DeviceContext {
  [deviceId: string]: {
    rangeStartDate: Date;
    rangeEndDate: Date;
  };
}*/

interface Project {
  projectId: string;
  projectName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  fibitUserId: string;
  fitbitAccessToken: string;
  fitbitRefreshToken: string;
  lastTokenRefresh: Date;
  members: any[];
  devices: any[];
}

const DashboardContext = createContext<DashboardProps | undefined>(undefined);

const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const [projects, setProjects] = useState<any[]>([]);

  const AUTH_ENDPOINT =
    import.meta.env.VITE_APP_NODE_ENV === "production"
      ? import.meta.env.VITE_APP_AUTH_ENDPOINT
      : import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT;

  const fetchProjects = async () => {
    try {
      const response = await axios.get(AUTH_ENDPOINT, {
        withCredentials: true,
      });
      setProjects(response.data.user.projects);
      setProjects(testProjects);
    } catch (error) {
      console.log(error);
      setProjects(testProjects);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <DashboardContext.Provider value={{ projects }}>
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
