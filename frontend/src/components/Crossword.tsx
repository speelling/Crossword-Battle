import React, { useState } from 'react';
import { CrosswordProps } from '../utils/types';
import '../styles/Crossword.css';
const Crossword: React.FC<CrosswordProps> = ({ puzzle, clues, dim }) => {
  const [userGrid, setUserGrid] = useState<string[][]>(
    Array(dim.rows).fill("").map(() => Array(dim.cols).fill(""))
  );
  const [selectedClue, setSelectedClue] = useState<{clueId: number, direction: string} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, x: number, y: number) => {
    const value = e.target.value.toUpperCase();
    if (value.length > 1) return;

    const newGrid = [...userGrid];
    newGrid[x][y] = value;
    setUserGrid(newGrid);
  };

  const handleCellClick = (x: number, y: number) => {
    const cell = puzzle.find(c => c.position.x === x && c.position.y === y);
    if (!cell || cell.isBlack) return;

    const currentClue = selectedClue?.clueId === cell.clues[0] ? cell.clues[1] : cell.clues[0];

    const newClue = clues.find(clue => clue.clueId === currentClue);


    if (newClue) {
      setSelectedClue({ clueId: newClue.clueId, direction: newClue.direction });
    }
  };

  const isCellHighlighted = (x: number, y: number) => {
    if (!selectedClue) return false;
    
    const activeClue = clues.find(clue => clue.clueId === selectedClue.clueId);
    if (!activeClue) return false;
  
    const highlighted = activeClue.cells.some(([cellX, cellY]) => cellX === x && cellY === y);
    
    return highlighted;
  };
  

  const renderGrid = () => {
    let grid = [];

    for (let i = 0; i < dim.rows; i++) {
      let row = [];
      
      for (let j = 0; j < dim.cols; j++) {
        const cell = puzzle.find(c => c.position.x === i && c.position.y === j);

        if (cell) {
          if (cell.isBlack) {
            row.push(<td key={`${i}-${j}`} className="black-cell"></td>);
          } else {
            const isHighlighted = isCellHighlighted(i, j);
            const cellClass = isHighlighted ? "cell highlighted" : "cell";

            row.push(
              <td key={`${i}-${j}`} className={cellClass} onClick={() => handleCellClick(i, j)}>
                <input
                  type="text"
                  maxLength={1}
                  value={userGrid[i][j]}
                  onChange={(e) => handleInputChange(e, i, j)}
                />
              </td>
            );
          }
        } else {
          row.push(<td key={`${i}-${j}`} className="cell"></td>);
        }
      }
      grid.push(<tr key={i}>{row}</tr>);
    }

    return grid;
  };

  const renderClues = (direction: 'across' | 'down') => {
    return clues
      .filter(clue => clue.direction === direction)
      .map(clue => (
        <li key={clue.clueId}>
          {clue.clueId + 1} {clue.text}
        </li>
      ));
  };

  const checkAnswers = () => {
    let correct = true;
    for (let i = 0; i < dim.rows; i++) {
      for (let j = 0; j < dim.cols; j++) {
        const cell = puzzle.find(c => c.position.x === i && c.position.y === j);
        if (cell && !cell.isBlack) {
          if (userGrid[i][j] !== cell.answer) {
            correct = false;
            break;
          }
        }
      }
    }
    alert(correct ? "Correct!" : "Some answers are incorrect. Keep trying!");
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
