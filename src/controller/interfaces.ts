export interface ISeed {
  type: 'corn' | 'green' | 'black';
  row: number;
  col: number;
}

export interface IToClear {
  seeds: ISeed[];
  isBost?: 'axe' | 'fork' | 'shovel';
}
export const SeedsTypesAsArr = ['corn', 'green', 'black'];

export interface IMove {
  row: number;
  col: number;
  swapRow: number;
  swapCol: number;
  isValid: boolean;
}

export interface IGameState {
  seeds: ISeed[][];
  moves: IMove[];
  boardSize: number;
  isMoving: boolean;
}

export interface IGameFunctions {
  hasMove: () => boolean;
  tryMove: (move: Partial<IMove>) => { move: IMove; matching?: IToClear };
  spawnSeeds: () => void;
  getLives: () => number;
  getScore: () => number;
  updateMatching: (matching: IToClear) => void;
  getEmptyCells: () => { col: number; rows: number[] }[];
}
