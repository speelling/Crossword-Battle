import session from "express-session";
import { IncomingMessage } from "http";

export interface ClientToServerEvents {
    joinGame: (data: { gameId: string }) => void;
    makeMove: (data: { gameId: string; move: Move }) => void;
  }
  
  export interface ServerToClientEvents {
    gameState: (state: GameState) => void;
    gameStarted: (data: { gameId: string }) => void;
    gameEnded: (data: { gameId: string; winner: string }) => void;
    gameExpired: (data: { gameId: string; message: string }) => void;
    updatePlayerState: (data: { gameId: string; puzzle: Cell[] }) => void;
    error: (data: { message: string }) => void;
  }
  
  export interface GameState {
    gameId: string;
    clues: Clue[];
    dim: Dimensions;
    status: string;
    puzzle: Cell[];
  }
  
  export interface Cell {
    isBlack: boolean;
    position: Position;
    clues: number[];
    value?: string;
  }
  
  export interface Position {
    x: number;
    y: number;
  }
  
  export interface Clue {
    clueId: number;
    direction: 'across' | 'down';
    text: string;
    cells: [number, number][];
  }
  
  export interface Dimensions {
    rows: number;
    cols: number;
  }
  
  export interface Move {
    position: Position;
    value: string;
  }

  export interface ExtendedIncomingMessage extends IncomingMessage {
    session: session.Session & Partial<session.SessionData>;
  }