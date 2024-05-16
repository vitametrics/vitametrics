import React from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) => {
  const pages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div
      id="pagination"
      className="flex flex-row mt-auto ml-auto items-center "
    >
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`w-[35px] bg-transparent text-primary  ${currentPage === i + 1 ? "underline" : ""}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
