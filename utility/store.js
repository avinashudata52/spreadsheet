// src/store.js
import create from 'zustand';

const useSpreadsheetStore = create((set, get) => ({
  cells: Array(1000).fill('').map((_, index) => ({ id: index, value: '', type: 'text' })),
  updateCell: (id, value, type) => set((state) => {
    const newCells = state.cells.map(cell => 
      cell.id === id ? { ...cell, value, type } : cell
    );
    return { cells: newCells };
  }),
  undo: [],
  redo: [],
  addUndo: (action) => set((state) => ({ undo: [...state.undo, action] })),
  addRedo: (action) => set((state) => ({ redo: [...state.redo, action] })),
  clearRedo: () => set({ redo: [] }),
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  filteredCells: [],
  setFilteredCells: (cells) => set({ filteredCells: cells }),
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  cellsPerPage: 100,
}));

export default useSpreadsheetStore;