import { useState } from "react";

const useSearch = (items, setCurrentPage) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  // Filter members based on the search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, handleSearchChange, filteredItems };
};

export default useSearch;
