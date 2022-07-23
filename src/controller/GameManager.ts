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
    seeds
  }: {
    boardSize?: number;
    minMatch?: number;
    seeds?: ISeed[][];
  } = {}) {
    if (
      seeds &&
      (seeds.some((col) => col.length !== seeds.length) || !seeds.length)
    ) {
      throw new Error('seeds must be a square with some length');
    }

    this.moves = [];
    this.isMoving = false;
    this.minMatch = minMatch;
    if (!seeds) {
      this.boardSize = boardSize;
      do {
        this.seeds = this.spawnSeeds({ allowMatching: false });
      } while (!this.hasMove().length);
    } else {
      this.seeds = seeds;
      this.boardSize = seeds.length;
    }
  }

  getRandomSeed = () => {
    return SeedsTypesAsArr[Math.floor(Math.random() * SeedsTypesAsArr.length)];
  };

  hasMove = () => {
    const moves: { move: IMove; matching?: IToClear }[] = [];
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (i + 1 < this.boardSize) {
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

        if (j + 1 < this.boardSize) {
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
      (!colMov && !rowMov) || // Move to same spot
      (colMov && rowMov) || // Trying to move diagonally
      colMov > 1 || // Jumping a spot
      rowMov > 1
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

  createEmptySeeds = (): null[][] => {
    const newSeeds = [];
    for (let i = 0; i < this.boardSize; ++i) {
      newSeeds.push(Array(this.boardSize).fill(null) as null[]);
    }
    return newSeeds;
  };

  getMatchingCols = (seeds: (ISeed | null)[][] = this.seeds) => {
    const seedsTransposed: (ISeed | null)[][] = this.createEmptySeeds();
    for (let i = 0; i < this.boardSize; ++i) {
      for (let j = 0; j < this.boardSize; ++j) {
        seedsTransposed[j][i] = seeds[i][j];
      }
    }
    return this.getMatchingRows(seedsTransposed);
  };
  getMatchingRows = (seeds: (ISeed | null)[][] = this.seeds) => {
    const matchingSeeds: ISeed[] = [];
    for (let i = 0; i < this.boardSize; ++i) {
      let latestSeedType: string | null = null;
      let counter = 1;
      const col = seeds[i];
      for (let j = 0; j < this.boardSize; ++j) {
        const seed = seeds[i][j];
        if (seed?.type === latestSeedType) {
          counter += 1;
          if (j >= this.boardSize - 1 && counter >= this.minMatch) {
            matchingSeeds.push(
              ...(col.slice(j - counter + 1, j + 1) as ISeed[])
            );
          }
        } else {
          if (counter >= this.minMatch) {
            matchingSeeds.push(...(col.slice(j - this.minMatch, j) as ISeed[]));
          }
          counter = seed ? 1 : 0;
        }
        latestSeedType = seed?.type ?? null;
      }
    }
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
    let newSeeds = seeds ? _.cloneDeep(seeds) : this.createEmptySeeds();
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
