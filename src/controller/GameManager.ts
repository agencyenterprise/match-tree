import {
  IGameState,
  IGameFunctions,
  IMove,
  ISeed,
  IToClear,
  SeedsTypesAsArr
} from './interfaces';
import _ from 'lodash';
export class GameManager implements IGameState, IGameFunctions {
  seeds: ISeed[][];
  moves: IMove[];
  boardSize: number;
  isMoving: boolean;

  constructor(boardSize: number = 10, seeds?: ISeed[][]) {
    this.moves = [];
    this.isMoving = false;
    if (!seeds) {
      this.boardSize = boardSize;
      this.seeds = this.init(this.boardSize);
    } else {
      this.seeds = seeds;
      this.boardSize = seeds.length;
    }
  }
  init = (size: number) => {
    const seeds: ISeed[][] = [[]];
    for (let i = 0; i < size; i++) {
      seeds[i] = [];
      for (let j = 0; j < size; j++) {
        seeds[i][j] = { col: i, row: j, type: this.getRandomSeed() };
      }
    }
    return seeds;
  };

  getRandomSeed = () => {
    return SeedsTypesAsArr[
      Math.floor(Math.random() * SeedsTypesAsArr.length)
    ] as 'corn' | 'green' | 'black';
  };

  hasMove = () => true;
  tryMove = () => {
    const move: IMove = {
      col: 0,
      isValid: true,
      row: 0,
      swapCol: 0,
      swapRow: 0
    };

    return { move };
  };
  getMatchingRows = () => {};

  spawnSeeds = () => {};
  getLives = () => 0;
  getScore = () => 0;
  updateMatching!: (matching: IToClear) => 0;
  getEmptyCells!: () => { col: number; rows: number[] }[];
}
