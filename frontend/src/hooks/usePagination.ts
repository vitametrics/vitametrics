import { useState } from 'react';

const usePagination = (initialItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); 
};

  return { currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, handleItemsPerPageChange };
};

export default usePagination;
