// src/components/ToolbarButtons.js
import useSpreadsheetStore from '@/utility/store';
import React from 'react';

const ToolbarButtons = () => {
  const { undo, redo, updateCell, addUndo, addRedo } = useSpreadsheetStore();

  const handleUndo = () => {
    if (undo.length > 0) {
      const lastAction = undo[undo.length - 1];
      updateCell(lastAction.id, lastAction.oldCell.value, lastAction.oldCell.type);
      addRedo(lastAction);
      useSpreadsheetStore.setState((state) => ({
        undo: state.undo.slice(0, -1),
      }));
    }
  };

  const handleRedo = () => {
    if (redo.length > 0) {
      const nextAction = redo[redo.length - 1];
      updateCell(nextAction.id, nextAction.newCell.value, nextAction.newCell.type);
      addUndo(nextAction);
      useSpreadsheetStore.setState((state) => ({
        redo: state.redo.slice(0, -1),
      }));
    }
  };

  return (
    <div className="mb-4 flex space-x-2">
      <button
        onClick={handleUndo}
        disabled={undo.length === 0}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Undo
      </button>
      <button
        onClick={handleRedo}
        disabled={redo.length === 0}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Redo
      </button>
    </div>
  );
};

export default ToolbarButtons;