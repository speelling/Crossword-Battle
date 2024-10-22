import React, { useState } from 'react';
import { CrosswordProps } from '../utils/types';
import '../styles/Crossword.css';

const Crossword: React.FC<CrosswordProps> = ({ puzzle, clues, dim, onMove }) => {
  const [userGrid, setUserGrid] = useState<string[][]>(
    Array(dim.rows).fill("").map(() => Array(dim.cols).fill(""))
  );
  const [selectedClue, setSelectedClue] = useState<{ clueId: number; direction: string } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    x: number, 
    y: number  
  ) => {
    const value = e.target.value.toUpperCase();
    if (value.length > 1) return;

    const newGrid = [...userGrid];
    newGrid[x][y] = value;
    setUserGrid(newGrid);

    onMove(x, y, value);
  };

  const handleCellClick = (x: number, y: number) => {
    const cell = puzzle.find(
      (c: any) => c.position.x === x && c.position.y === y
    );
    if (!cell || cell.isBlack) return;

    const currentClue =
      selectedClue?.clueId === cell.clues[0] ? cell.clues[1] : cell.clues[0];

    const newClue = clues.find((clue: any) => clue.clueId === currentClue);

    if (newClue) {
      setSelectedClue({
        clueId: newClue.clueId,
        direction: newClue.direction,
      });
    }
  };

  const isCellHighlighted = (x: number, y: number) => {
    if (!selectedClue) return false;

    const activeClue = clues.find(
      (clue: any) => clue.clueId === selectedClue.clueId
    );
    if (!activeClue) return false;

    return activeClue.cells.some(
      ([cellX, cellY]) => cellX === x && cellY === y
    );
  };

  const renderGrid = () => {
    let grid = [];

    for (let x = 0; x < dim.rows; x++) {
      let row = [];

      for (let y = 0; y < dim.cols; y++) {
        const cell = puzzle.find(
          (c: any) => c.position.x === x && c.position.y === y
        );

        if (cell) {
          if (cell.isBlack) {
            row.push(<td key={`${x}-${y}`} className="black-cell"></td>);
          } else {
            const isHighlighted = isCellHighlighted(x, y);
            const cellClass = isHighlighted ? "cell highlighted" : "cell";

            row.push(
              <td
                key={`${x}-${y}`}
                className={cellClass}
                onClick={() => handleCellClick(x, y)}
              >
                <input
                  type="text"
                  maxLength={1}
                  value={userGrid[x][y]}
                  onChange={(e) => handleInputChange(e, x, y)}
                />
              </td>
            );
          }
        } else {
          row.push(<td key={`${x}-${y}`} className="cell"></td>);
        }
      }
      grid.push(<tr key={x}>{row}</tr>);
    }

    return grid;
  };

  const handleClueClick = (clueId: number, direction: string) => {
    setSelectedClue({ clueId, direction });
  };

  const renderClues = (direction: 'across' | 'down') => {
    return clues
      .filter((clue: any) => clue.direction === direction)
      .map((clue: any) => (
        <li key={clue.clueId}>
          <span
            className="clue-text"
            onClick={() => handleClueClick(clue.clueId, direction)}
          >
            {clue.clueId + 1} {clue.text}
          </span>
        </li>
      ));
  };

  const renderSelectedClueText = () => {
    if (!selectedClue) return null;
    
    const clue = clues.find((clue: any) => clue.clueId === selectedClue.clueId);
    if (clue) {
      return (
        <div className="selected-clue">
          <strong>  {selectedClue.clueId}{selectedClue.direction[0]}</strong> {clue.text}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="crossword-wrapper">
      {renderSelectedClueText()}

      <div className="crossword-grid-container">
        <table className="crossword-grid">
          <tbody>{renderGrid()}</tbody>
        </table>

        <div className="clue-section">
          <div className="across">
            <h3>Across</h3>
            <ul>{renderClues('across')}</ul>
          </div>
          <div className="down">
            <h3>Down</h3>
            <ul>{renderClues('down')}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crossword;
