import {
  IGameState,
  IGameFunctions,
  IMove,
  ISeed,
  IToClear,
  SeedsTypesAsArr,
  SeedType
} from './interfaces';
import * as _ from 'lodash';
export class GameManager implements IGameState, IGameFunctions {
  seeds: ISeed[][];
  moves: IMove[];
  boardSize: number;
  isMoving: boolean;
  minMatch: number;

  constructor({
    boardSize = 10,
    minMatch = 3,
    seeds = undefined
  }: {
    boardSize?: number;
    minMatch?: number;
    seeds?: ISeed[][];
  }) {
    this.moves = [];
    this.isMoving = false;
    this.minMatch = minMatch;
    if (!seeds) {
      this.boardSize = boardSize;
      this.seeds = this.spawnSeeds(/* { allowMatching: false } */);
    } else {
      this.seeds = seeds;
      this.boardSize = seeds.length;
    }
  }

  getRandomSeed = () => {
    return SeedsTypesAsArr[
      Math.floor(Math.random() * SeedsTypesAsArr.length)
    ] as SeedType;
  };

  hasMove = () => {
    const moves: { move: IMove; matching?: IToClear }[] = [];
    for (let i = 0; i < this.seeds.length; i++) {
      for (let j = 0; j < this.seeds.length; j++) {
        if (i + 1 < this.seeds.length) {
          const move = this.tryMove({
            col: i,
            row: j,
            targetCol: i + 1,
            targetRow: j
          });
          if (move.move.isValid) {
            moves.push(move);
          }
        }

        if (j + 1 < this.seeds.length) {
          const move = this.tryMove({
            col: i,
            row: j,
            targetCol: i,
            targetRow: j + 1
          });

          if (move.move.isValid) {
            moves.push(move);
          }
        }
      }
    }

    return _.uniq(moves);
  };
  tryMove = (
    move: Omit<IMove, 'isValid'>
  ): { move: IMove; matching?: IToClear } => {
    const colMov = Math.abs(move.col - move.targetCol);
    const rowMov = Math.abs(move.row - move.targetRow);
    if (
      (colMov === 0 && rowMov == 0) || // Move to same spot
      colMov > 1 || // Jumping a spot
      rowMov > 1 ||
      (colMov === 1 && rowMov !== 0) || // Trying to move diagonally
      (rowMov === 1 && colMov !== 0)
    ) {
      return { move: { ...move, isValid: false } };
    }

    const newSeeds = _.cloneDeep(this.seeds);
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

    const seeds = this.getMatching(newSeeds);
    if (seeds.length) {
      return { move: { ...move, isValid: true }, matching: { seeds } };
    } else {
      return { move: { ...move, isValid: false } };
    }
  };
  getMatchingCols = (seeds: (ISeed | null)[][] = this.seeds) => {
    const seedRows: (ISeed | null)[][] = [];
    seeds.forEach((cols) => {
      cols.forEach((seed, rowIndex) => {
        if (!seedRows[rowIndex]) {
          seedRows[rowIndex] = [];
        }
        seedRows[rowIndex].push(seed);
      });
    });
    return this.getMatchingRows(seedRows);
  };
  getMatchingRows = (seeds: (ISeed | null)[][] = this.seeds) => {
    const matchingSeeds: ISeed[] = [];
    seeds.forEach((col) => {
      let latestSeedType: string | null = null;
      let counter = 1;
      col.forEach((seed, seedIndex) => {
        if (!seed) {
          counter = 0;
        } else if (seed.type === latestSeedType) {
          counter += 1;
          if (seedIndex >= col.length - 1 && counter >= this.minMatch) {
            matchingSeeds.push(
              ...(col.slice(seedIndex - counter + 1, seedIndex + 1) as ISeed[])
            );
          }
        } else {
          if (counter >= this.minMatch) {
            matchingSeeds.push(
              ...(col.slice(seedIndex - this.minMatch, seedIndex) as ISeed[])
            );
          }
          counter = 1;
        }
        latestSeedType = seed?.type ?? null;
      });
    });
    return matchingSeeds;
  };

  getMatching = (seeds: (ISeed | null)[][] = this.seeds) => {
    const matching = [
      ...this.getMatchingCols(seeds),
      ...this.getMatchingRows(seeds)
    ];
    return _.uniq(matching);
  };

  spawnSeeds = ({
    seeds = null,
    allowMatching = true
  }: {
    seeds?: (ISeed | null)[][] | null;
    allowMatching?: boolean;
  } = {}): ISeed[][] => {
    let newSeeds: (ISeed | null)[][];
    if (seeds) {
      newSeeds = _.cloneDeep(seeds);
    } else {
      newSeeds = [];
      for (let i = 0; i < this.boardSize; ++i) {
        newSeeds.push([]);
        for (let j = 0; j < this.boardSize; ++j) {
          newSeeds[i] = Array(this.boardSize).fill(null) as null[];
        }
      }
    }
    for (let i = 0; i < this.boardSize; ++i) {
      for (let j = 0; j < this.boardSize; ++j) {
        const seed = seeds?.[i][j];
        if (seed == null) {
          do {
            newSeeds[i][j] = {
              col: i,
              row: j,
              type: this.getRandomSeed()
            };
          } while (!allowMatching && this.getMatching(newSeeds).length);
        } else {
          newSeeds[i][j] = seed;
        }
      }
    }
    return newSeeds as ISeed[][];
  };
  getLives = () => 0;
  getScore = () => 0;
  updateMatching!: (matching: IToClear) => 0;
  getEmptyCells!: () => { col: number; rows: number[] }[];
}
