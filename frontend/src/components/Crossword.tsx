// src/components/Crossword.tsx
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
    y: number,
    x: number
  ) => {
    const value = e.target.value.toUpperCase();
    if (value.length > 1) return;

    const newGrid = [...userGrid];
    newGrid[y][x] = value;
    setUserGrid(newGrid);

    onMove(x, y, value);
  };

  const handleCellClick = (y: number, x: number) => {
    const cell = puzzle.find(
      (c: any) => c.position.x === x && c.position.y === y
    );
    if (!cell || cell.isBlack) return;

    const currentClue =
      selectedClue?.clueId === cell.clues[0] ? cell.clues[1] : cell.clues[0];

    const newClue = clues.find((clue: any) => clue.clueId === currentClue);

    if (newClue) {
      setSelectedClue({ clueId: newClue.clueId, direction: newClue.direction });
    }
  };

  const isCellHighlighted = (y: number, x: number) => {
    if (!selectedClue) return false;

    const activeClue = clues.find(
      (clue: any) => clue.clueId === selectedClue.clueId
    );
    if (!activeClue) return false;

    const highlighted = activeClue.cells.some(([cellX, cellY]) => cellX === x && cellY === y);

    return highlighted;
  };

  const renderGrid = () => {
    let grid = [];

    for (let y = 0; y < dim.rows; y++) {
      let row = [];

      for (let x = 0; x < dim.cols; x++) {
        const cell = puzzle.find(
          (c: any) => c.position.x === x && c.position.y === y
        );

        if (cell) {
          if (cell.isBlack) {
            row.push(<td key={`${y}-${x}`} className="black-cell"></td>);
          } else {
            const isHighlighted = isCellHighlighted(y, x);
            const cellClass = isHighlighted ? "cell highlighted" : "cell";

            row.push(
              <td
                key={`${y}-${x}`}
                className={cellClass}
                onClick={() => handleCellClick(y, x)}
              >
                <input
                  type="text"
                  maxLength={1}
                  value={userGrid[y][x]}
                  onChange={(e) => handleInputChange(e, y, x)}
                />
              </td>
            );
          }
        } else {
          row.push(<td key={`${y}-${x}`} className="cell"></td>);
        }
      }
      grid.push(<tr key={y}>{row}</tr>);
    }

    return grid;
  };

  const renderClues = (direction: 'across' | 'down') => {
    return clues
      .filter((clue: any) => clue.direction === direction)
      .map((clue: any) => (
        <li key={clue.clueId}>
          {clue.clueId + 1} {clue.text}
        </li>
      ));
  };

  return (
    <div className="crossword-container">
      <table className="crossword-grid">
        <tbody>{renderGrid()}</tbody>
      </table>

      <div className="clues">
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
  );
};

export default Crossword;
