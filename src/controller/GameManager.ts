import {
  IGameState,
  IGameFunctions,
  IMove,
  ISeed,
  IToClear,
  SeedsTypesAsArr
} from './interfaces';
import * as _ from 'lodash';
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
  tryMove = (
    move: Omit<IMove, 'isValid'>
  ): { move: IMove; matching?: IToClear } => {
    const newSeeds = this.seeds.slice();
    const currentSeed = newSeeds[move.col][move.row];
    const targetSeed = newSeeds[move.targetCol][move.targetRow];
    newSeeds[move.col][move.row] = {
      ...targetSeed,
      col: move.col,
      row: move.row
    };
    newSeeds[move.targetCol][move.targetRow] = {
      ...currentSeed,
      col: move.targetCol,
      row: move.targetRow
    };

    const seeds = this.getMatching();
    if (seeds.length) {
      return { move: { ...move, isValid: true }, matching: { seeds } };
    } else {
      return { move: { ...move, isValid: false } };
    }
  };
  getMatchingCols = () => {
    const seedRows: ISeed[][] = [];
    this.seeds.forEach((cols) => {
      cols.forEach((seed, rowIndex) => {
        if (!seedRows[rowIndex]) {
          seedRows[rowIndex] = [];
        }
        seedRows[rowIndex].push(seed);
      });
    });

    const matchingSeeds: ISeed[] = [];
    seedRows.forEach((row) => {
      let latestSeedType: string = '';
      let counter = 1;
      row.forEach((seed, seedIndex) => {
        if (seed.type === latestSeedType) {
          counter += 1;
          if (seedIndex >= row.length - 1 && counter >= 3) {
            matchingSeeds.push(
              ...row.slice(seedIndex - counter + 1, seedIndex + 1)
            );
          }
        } else {
          if (counter >= 3) {
            matchingSeeds.push(...row.slice(seedIndex - 3, seedIndex));
          }
          counter = 1;
        }
        latestSeedType = seed.type;
      });
    });
    return matchingSeeds;
  };
  getMatchingRows = () => {
    const matchingSeeds: ISeed[] = [];
    this.seeds.forEach((col) => {
      let latestSeedType: string = '';
      let counter = 1;
      col.forEach((seed, seedIndex) => {
        if (seed.type === latestSeedType) {
          counter += 1;
          if (seedIndex >= col.length - 1 && counter >= 3) {
            matchingSeeds.push(
              ...col.slice(seedIndex - counter + 1, seedIndex + 1)
            );
          }
        } else {
          if (counter >= 3) {
            matchingSeeds.push(...col.slice(seedIndex - 3, seedIndex));
          }
          counter = 1;
        }
        latestSeedType = seed.type;
      });
    });
    return matchingSeeds;
  };

  getMatching = () => {
    const matching = [...this.getMatchingCols(), ...this.getMatchingRows()];
    return _.uniq(matching);
  };

  spawnSeeds = () => {};
  getLives = () => 0;
  getScore = () => 0;
  updateMatching!: (matching: IToClear) => 0;
  getEmptyCells!: () => { col: number; rows: number[] }[];
}
