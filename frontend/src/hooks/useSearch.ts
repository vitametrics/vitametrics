/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const useSearch = (items: any[], setCurrentPage: (page: number) => void) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Filter members based on the search term
  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, handleSearchChange, filteredItems };
};

export default useSearch;
