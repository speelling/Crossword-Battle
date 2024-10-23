import React, { useEffect, useState } from 'react';
import { CrosswordProps, Cell } from '../utils/types';
import '../styles/Crossword.css';

const Crossword: React.FC<CrosswordProps> = ({ puzzle, clues, dim, onMove }) => {
  const [userGrid, setUserGrid] = useState<string[][]>(
    Array(dim.rows).fill("").map(() => Array(dim.cols).fill(""))
  );


  useEffect(() => {
    const grid = Array(dim.rows).fill("").map(() => Array(dim.cols).fill(""));

    puzzle.forEach((cell: Cell) => {
      if (!cell.isBlack) {
        const x = cell.position.x;
        const y = cell.position.y;
        grid[x][y] = cell.value || "";
      }
    });

    setUserGrid(grid);
  }, [puzzle, dim.rows, dim.cols]);
  const [selectedClue, setSelectedClue] = useState<{ clueId: number; direction: string }>({
    clueId: 5, 
    direction: 'across'
  });
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    x: number,
    y: number
  ) => {
    let nextX = x;
    let nextY = y;

    switch (e.key) {
      case 'ArrowUp':
        nextX = x - 1;
        break;
      case 'ArrowDown':
        nextX = x + 1;
        break;
      case 'ArrowLeft':
        nextY = y - 1;
        break;
      case 'ArrowRight':
        nextY = y + 1;
        break;
      case 'Backspace':
        e.preventDefault();
        const newGrid = [...userGrid];
        newGrid[x][y] = '';
        setUserGrid(newGrid);
        onMove(x, y, '');

        handleBackspace(x, y);
        return;
      default:
        return; 
    }

    e.preventDefault();

    if (nextX < 0 || nextX >= dim.rows || nextY < 0 || nextY >= dim.cols) {
      return;
    }

    const cell = puzzle.find(
      (c: Cell) => c.position.x === nextX && c.position.y === nextY
    );
    if (!cell || cell.isBlack) {
      return; 
    }

    const nextInput = document.querySelector(
      `input[data-position-x="${nextX}"][data-position-y="${nextY}"]`
    ) as HTMLInputElement;

    if (nextInput) {
      nextInput.focus();
      nextInput.select(); 
      setSelectedCell({ x: nextX, y: nextY });

      const clueId = cell.clues.find((clueId) => {
        const clue = clues.find((clue) => clue.clueId === clueId);
        return clue && clue.direction === selectedClue.direction;
      });

      if (clueId !== undefined) {
        setSelectedClue({ clueId, direction: selectedClue.direction });
      }
    }
  };

  const handleBackspace = (x: number, y: number) => {
    const clue = clues.find((clue) => clue.clueId === selectedClue.clueId);

    if (clue) {
      const cellIndex = clue.cells.findIndex(
        ([cellX, cellY]) => cellX === x && cellY === y
      );

      if (cellIndex > 0) {
        const [prevX, prevY] = clue.cells[cellIndex - 1];

        const prevInput = document.querySelector(
          `input[data-position-x="${prevX}"][data-position-y="${prevY}"]`
        ) as HTMLInputElement;

        if (prevInput) {
          prevInput.focus();
          prevInput.select(); 
          setSelectedCell({ x: prevX, y: prevY });
        }
      }
    }
  };

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

    const clue = clues.find((clue) => clue.clueId === selectedClue.clueId);

    if (clue) {
      const cellIndex = clue.cells.findIndex(
        ([cellX, cellY]) => cellX === x && cellY === y
      );

      if (cellIndex >= 0 && cellIndex < clue.cells.length - 1) {
        const [nextX, nextY] = clue.cells[cellIndex + 1];

        const nextInput = document.querySelector(
          `input[data-position-x="${nextX}"][data-position-y="${nextY}"]`
        ) as HTMLInputElement;

        if (nextInput) {
          nextInput.focus();
          nextInput.select(); 
          setSelectedCell({ x: nextX, y: nextY });
        }
      } else {
      }
    }
  };

  const handleCellClick = (x: number, y: number) => {
    const cell = puzzle.find(
      (c: Cell) => c.position.x === x && c.position.y === y
    );
    if (!cell || cell.isBlack) return;

    if (selectedCell && selectedCell.x === x && selectedCell.y === y) {
      const newDirection = selectedClue.direction === 'across' ? 'down' : 'across';

      const clueId = cell.clues.find((clueId) => {
        const clue = clues.find((clue) => clue.clueId === clueId);
        return clue && clue.direction === newDirection;
      });

      if (clueId !== undefined) {
        setSelectedClue({ clueId, direction: newDirection });
        setSelectedCell({ x, y });
      }
    } else {
      const clueId = cell.clues.find((clueId) => {
        const clue = clues.find((clue) => clue.clueId === clueId);
        return clue && clue.direction === selectedClue.direction;
      });

      if (clueId !== undefined) {
        setSelectedClue({ clueId, direction: selectedClue.direction });
      } else {
        const firstClueId = cell.clues[0]; 
        const firstClue = clues.find((clue) => clue.clueId === firstClueId);

        if (firstClue) {
          setSelectedClue({ clueId: firstClue.clueId, direction: firstClue.direction });
        }
      }

      setSelectedCell({ x, y });
    }
  };

  const isCellHighlighted = (x: number, y: number) => {
    if (!selectedClue) return false;

    const activeClue = clues.find(
      (clue) => clue.clueId === selectedClue.clueId
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
          (c: Cell) => c.position.x === x && c.position.y === y
        );

        if (cell) {
          if (cell.isBlack) {
            row.push(<td key={`${x}-${y}`} className="black-cell"></td>);
          } else {
            const isHighlighted = isCellHighlighted(x, y);
            const isCurrentCell = selectedCell && selectedCell.x === x && selectedCell.y === y;

            let cellClass = 'cell';
            if (isCurrentCell) {
              cellClass += ' current-cell';
            } else if (isHighlighted) {
              cellClass += ' highlighted';
            }

            row.push(
              <td
                key={`${x}-${y}`}
                className={cellClass}
                onClick={() => handleCellClick(x, y)}
              >
                {cell.clues[0] !== undefined && (
                  <div className="number">{cell.clues[0]}</div>
                )}
                <input
                  type="text"
                  maxLength={1}
                  value={userGrid[x][y]}
                  onChange={(e) => handleInputChange(e, x, y)}
                  onKeyDown={(e) => handleKeyDown(e, x, y)}
                  data-position-x={x}
                  data-position-y={y}
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
    const clue = clues.find((clue) => clue.clueId === clueId);
    if (clue && clue.cells.length > 0) {
      const [x, y] = clue.cells[0];
      setSelectedCell({ x, y });
      const input = document.querySelector(
        `input[data-position-x="${x}"][data-position-y="${y}"]`
      ) as HTMLInputElement;

      if (input) {
        input.focus();
        input.select();
      }
    }
  };

  const renderClues = (direction: 'across' | 'down') => {
    return clues
      .filter((clue) => clue.direction === direction)
      .map((clue) => (
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

    const clue = clues.find((clue) => clue.clueId === selectedClue.clueId);
    if (clue) {
      return (
        <div className="selected-clue">
          <strong>
            {selectedClue.clueId + 1}
            {selectedClue.direction[0].toUpperCase()}
          </strong>{' '}
          {clue.text}
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
