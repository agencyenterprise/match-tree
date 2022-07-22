export const SeedsTypesAsArr = ['corn', 'green', 'black'];
export type SeedType = typeof SeedsTypesAsArr[number];

export interface ISeed {
  type: SeedType;
  row: number;
  col: number;
}

export interface IToClear {
  seeds: ISeed[];
  isBoost?: 'axe' | 'fork' | 'shovel';
}

export interface IMove {
  row: number;
  col: number;
  targetRow: number;
  targetCol: number;
  isValid: boolean;
}

export interface IGameState {
  seeds: (ISeed | null)[][];
  moves: IMove[];
  boardSize: number;
  isMoving: boolean;
}

export interface IGameFunctions {
  hasMove: () => { move: IMove; matching?: IToClear }[];
  tryMove(move: Omit<IMove, 'isValid'>): { move: IMove; matching?: IToClear };
  spawnSeeds: (args: {
    seeds?: (ISeed | null)[][] | null;
    allowMatching?: boolean;
  }) => ISeed[][];
  getLives: () => number;
  getScore: () => number;
  updateMatching: (matching: IToClear) => void;
  getEmptyCells: () => { col: number; rows: number[] }[];
}
