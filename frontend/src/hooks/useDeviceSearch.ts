/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {OverviewDevice} from "../types/Device";

const useSearch = (items: any[], setCurrentPage: (page: number) => void) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Filter members based on the search term
  const filteredItems = items.filter((item: OverviewDevice) =>
    item.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, handleSearchChange, filteredItems };
};

export default useSearch;
