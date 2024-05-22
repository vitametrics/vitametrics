import React from "react";

const PaginationControls = ({
  itemsPerPage,
  handleItemsPerPageChange,
  itemsPerPageOptions,
  totalItems,
  currentPage,
  indexOfLastItem,
}: {
  itemsPerPage: number;
  handleItemsPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  itemsPerPageOptions: number[];
  totalItems: number;
  currentPage: number;
  indexOfLastItem: number;
}) => {
  return (
    <div className="flex flex-row mr-auto gap-2 text-primary mb-3 items-center">
      <span>
        {currentPage * itemsPerPage - itemsPerPage + 1} - {indexOfLastItem} /{" "}
        {totalItems} Results
      </span>
      <span>|</span>
      <span>
        Display
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className=" rounded-md p-1"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option} results
            </option>
          ))}
        </select>
      </span>
    </div>
  );
};

export default PaginationControls;
