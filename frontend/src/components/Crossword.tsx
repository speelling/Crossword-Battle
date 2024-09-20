import React, { useEffect, useState } from "react";

const targetCrossword = [
  [
    { letter: "A", isFilled: true },   // A1
    { letter: "A", isFilled: true },   // A2
    { letter: "", isFilled: false },  // Black Cell
    { letter: "A", isFilled: true },   // A3
    { letter: "A", isFilled: true }    // A4
  ],
  [
    { letter: "A", isFilled: true },   // B1
    { letter: "A", isFilled: true },   // B2
    { letter: "", isFilled: false },  // Black Cell
    { letter: "A", isFilled: true },   // B3
    { letter: "A", isFilled: true }    // B4
  ],
  [
    { letter: "", isFilled: false },  // Black Cell
    { letter: "", isFilled: false },  // Black Cell
    { letter: "", isFilled: false },  // Black Cell
    { letter: "", isFilled: false },  // Black Cell
    { letter: "", isFilled: false }   // Black Cell
  ],
  [
    { letter: "A", isFilled: true },   // C1
    { letter: "A", isFilled: true },   // C2
    { letter: "", isFilled: false },  // Black Cell
    { letter: "A", isFilled: true },   // C3
    { letter: "A", isFilled: true }    // C4
  ],
  [
    { letter: "A", isFilled: true },   // D1
    { letter: "A", isFilled: true },   // D2
    { letter: "", isFilled: false },  // Black Cell
    { letter: "A", isFilled: true },   // D3
    { letter: "A", isFilled: true }    // D4
  ]
];

type CrosswordCell = {
  letter: string;  
  isFilled: boolean;
};

type CrosswordProps = {
  rows: number;
  columns: number;
  crosswordData: CrosswordCell[][];
};

const Crossword: React.FC<CrosswordProps> = ({ rows, columns, crosswordData }) => {
  const [grid, setGrid] = useState<CrosswordCell[][]>(crosswordData);


  useEffect(() => {
    console.log(grid, targetCrossword);
    console.log(JSON.stringify(grid) === JSON.stringify(targetCrossword));
}, [grid]);


  const handleInputChange = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    newGrid[row][col].letter = value.toUpperCase(); 
    setGrid(newGrid);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 40px)`, 
        gridGap: "2px"
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <input
            key={`${rowIndex}-${colIndex}`}
            value={cell.letter}
            onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
            style={{
              width: "40px",
              height: "40px",
              textAlign: "center",
              fontSize: "20px",
              backgroundColor: cell.isFilled ? "#fff" : "#000",
              color: cell.isFilled ? "#000" : "#fff",
              border: "1px solid #ddd"
            }}
            maxLength={1}
            disabled={!cell.isFilled}
          />
        ))
      )}
    </div>
  );
};

export default Crossword;
