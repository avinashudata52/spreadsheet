// src/components/Spreadsheet.js

'use client'
import React, { useState, useEffect } from 'react';
import ToolbarButtons from './ToolbarButtons';
import SearchAndFilter from './SearchAndFilter';
import Pagination from './Pagination';
import useSpreadsheetStore from '@/utility/store';


const cellTypes = {
  text: { validate: () => true },
  number: { validate: (value) => !isNaN(value) },
  email: { validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
};

const Spreadsheet = () => {
  const {
    cells,
    updateCell,
    addUndo,
    clearRedo,
    searchTerm,
    filteredCells,
    currentPage,
    cellsPerPage
  } = useSpreadsheetStore();
  const [activeCell, setActiveCell] = useState(null);
  const [cellStyles, setCellStyles] = useState({});
  const [error, setError] = useState(null);

  const displayCells = filteredCells.length > 0 ? filteredCells : cells;
  const startIndex = (currentPage - 1) * cellsPerPage;
  const endIndex = startIndex + cellsPerPage;
  const visibleCells = displayCells.slice(startIndex, endIndex);

  const handleCellClick = (id) => {
    setActiveCell(id);
    setError(null);
  };

  const handleCellChange = (id, value, type) => {
    if (cellTypes[type].validate(value)) {
      const oldCell = cells.find(cell => cell.id === id);
      updateCell(id, value, type);
      addUndo({ id, oldCell, newCell: { id, value, type } });
      clearRedo();
      setError(null);
    } else {
      setError(`Invalid ${type} format`);
    }
  };

  const handleCellStyle = (property, value) => {
    if (activeCell !== null) {
      setCellStyles((prevStyles) => ({
        ...prevStyles,
        [activeCell]: {
          ...(prevStyles[activeCell] || {}),
          [property]: value,
        },
      }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && activeCell !== null) {
        const nextCell = activeCell + 1;
        if (nextCell < cells.length) setActiveCell(nextCell);
      } else if (e.key === 'ArrowLeft' && activeCell !== null) {
        const prevCell = activeCell - 1;
        if (prevCell >= 0) setActiveCell(prevCell);
      }
      else if (e.key === 'ArrowDown' && activeCell !== null) {
        const nextCell = activeCell + 10;
        if (nextCell < cells.length) setActiveCell(nextCell);
      } else if (e.key === 'ArrowUp' && activeCell !== null) {
        const prevCell = activeCell - 10;
        if (prevCell >= 0) setActiveCell(prevCell);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCell, cells.length]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Spreadsheet App</h1>
      <ToolbarButtons />
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => handleCellStyle('textAlign', 'left')}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
        >
          Align Left
        </button>
        <button
          onClick={() => handleCellStyle('textAlign', 'center')}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
        >
          Align Center
        </button>
        <button
          onClick={() => handleCellStyle('textAlign', 'right')}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
        >
          Align Right
        </button>
        <select
          onChange={(e) => handleCellStyle('fontSize', e.target.value)}
          value={cellStyles[activeCell]?.fontSize ? cellStyles[activeCell]?.fontSize : "16px"}
          className="bg-gray-100 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>
      </div>
      <SearchAndFilter />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="w-full overflow-x-auto shadow-lg rounded-lg">
        <div className="grid grid-cols-10 gap-0 bg-gray-50">
          {visibleCells.map((cell) => (
            <div
              key={cell.id}
              className="border cursor-pointer border-gray-200 min-w-[100px] h-10 flex items-center bg-white hover:bg-gray-50 transition duration-150"
              onClick={() => {
                handleCellClick(cell.id)
                console.log(cell.id);
              }
              }
            >
              {(activeCell === cell.id && searchTerm === "")? (
                <input
                  type="text"
                  value={cell.value}
                  onChange={(e) => handleCellChange(cell.id, e.target.value, cell.type)}
                  className="w-full h-full outline-none bg-blue-50 px-2"
                  autoFocus
                  style={cellStyles[cell.id]} 
                />
              ) : (
                <span style={cellStyles[cell.id]} className="truncate py-1.5 px-2 w-full h-full">{cell.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <Pagination />
    </div>
  );
};

export default Spreadsheet;