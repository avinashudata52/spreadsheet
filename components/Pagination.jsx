// src/components/Pagination.js
import useSpreadsheetStore from '@/utility/store';
import React from 'react';

const Pagination = () => {
  const { cells, filteredCells, currentPage, setCurrentPage, cellsPerPage } = useSpreadsheetStore();

  const totalCells = filteredCells.length > 0 ? filteredCells.length : cells.length;
  const totalPages = Math.ceil(totalCells / cellsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;