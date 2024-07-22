import { useState } from "react";

interface Account {
    userId: string;
    accessToken: string;
    refreshToken: string;
    lastTokenRefresh: string;
    projects: Array<{
      projectId: string;
      projectName: string;
      devices: Array<{
        _id: string;
        projectId: string;
        deviceName: string;
        deviceVersion: string;
        batteryLevel: string;
        deviceId: string;
        lastSyncTime: string;
      }>;
    }>;
}

const useSearch = (
  items: Account[],
  setCurrentPage: (page: number) => void
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredItems = items.filter((item) => 
    item.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, handleSearchChange, filteredItems };
};

export default useSearch;