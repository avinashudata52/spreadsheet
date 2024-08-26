// src/components/SearchAndFilter.js
import useSpreadsheetStore from '@/utility/store';
import React from 'react';

const SearchAndFilter = () => {
  const { cells, setSearchTerm, setFilteredCells } = useSpreadsheetStore();

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = cells.filter(cell => 
      cell.value.toLowerCase().includes(term)
    );
    setFilteredCells(filtered);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchAndFilter;