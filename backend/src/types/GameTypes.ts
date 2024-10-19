export interface CrosswordPuzzle {
    puzzle: Array<{
      answer: string;
      clues: number[];
      isBlack: boolean;
      position: { x: number; y: number };
    }>;
    clues: Array<{
      clueId: number;
      direction: 'across' | 'down';
      text: string;
      cells: [number, number][];
    }>;
    dim: { rows: number; cols: number };
  }