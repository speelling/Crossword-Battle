export interface Cell {
  answer: string;
  clues: number[];
  isBlack: boolean;
  position: {
    x: number;
    y: number;
  };
}

export interface Clue {
  clueId: number;
  direction: string;
  text: string;
  cells: number[][];
}

export interface CrosswordProps {
  puzzle: Cell[];
  clues: Clue[];
  dim: {
    rows: number;
    cols: number;
  };
  onMove: (x: number, y: number, value: string) => void;
}

export interface Move {
  position: { x: number; y: number };
  value: string;
}


export interface ClientToServerEvents {
  joinGame: (data: { gameId: string }) => void;
  makeMove: (data: { gameId: string; move: Move }) => void;
}

export interface ServerToClientEvents {
  gameState: (data: any) => void;
  gameStarted: () => void;
  gameEnded: (data: { gameId: string; winner: string }) => void;
  gameExpired: (data: { gameId: string; message: string }) => void;
  
  error: (data: { message: string }) => void;
}