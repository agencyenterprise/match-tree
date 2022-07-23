import { GameManager } from './GameManager';
import * as _ from 'lodash';
import { SeedType, ISeed } from './interfaces';

const shorthandTypeToSeedType = (type: 'b' | 'c' | 'g'): SeedType => {
  switch (type) {
    case 'b':
      return 'black';
    case 'c':
      return 'corn';
    case 'g':
      return 'green';
  }
};
const generateSeedsNullable = (...types: ('b' | 'c' | 'g' | null)[][]) =>
  types.map((col, i) =>
    col.map((type, j) =>
      type
        ? {
            col: i,
            row: j,
            type: shorthandTypeToSeedType(type)
          }
        : null
    )
  );
const generateSeeds = (...types: ('b' | 'c' | 'g')[][]) =>
  generateSeedsNullable(...types) as ISeed[][];

describe('on initialization', () => {
  it('create a board and inits a board', () => {
    const gamemanager = new GameManager({ boardSize: 10 });
    expect(gamemanager.boardSize).toEqual(10);
    expect(gamemanager.seeds.length).toEqual(10);
    expect(gamemanager.seeds[9].length).toEqual(10);
  });

  it('can override init seeds', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(['b', 'b', 'b'], ['c', 'g', 'b'], ['b', 'g', 'c'])
    });
    expect(gamemanager.boardSize).toEqual(3);
    expect(gamemanager.seeds.length).toEqual(3);
    expect(gamemanager.seeds[2].length).toEqual(3);
  });

  it('has cols and rows arranged correctly', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(['c', 'c', 'c'], ['c', 'g', 'b'], ['c', 'g', 'c'])
    });
    expect(gamemanager.seeds[1][2].type).toEqual('black');
  });

  it('validates seeds shape', () => {
    expect(
      () =>
        new GameManager({
          seeds: generateSeeds(['c', 'c'], ['c', 'g', 'b'], ['c', 'g', 'c'])
        })
    ).toThrow();
  });
});

describe('when checking if there is any move', () => {
  it('can find valid moves', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(
        ['b', 'c', 'b', 'g'],
        ['c', 'b', 'b', 'g'],
        ['g', 'c', 'g', 'c'],
        ['g', 'b', 'g', 'c']
      )
    });

    const moves = gamemanager.hasMove();
    expect(moves).toMatchSnapshot();
  });

  it('handles when there are no moves', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(['b', 'g', 'c'], ['c', 'b', 'c'], ['c', 'g', 'b'])
    });

    const moves = gamemanager.hasMove();
    expect(moves.length).toEqual(0);
  });
});

describe('when matching cols', () => {
  it('can get matching cols', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(
        ['b', 'c', 'g', 'g'],
        ['b', 'b', 'g', 'c'],
        ['b', 'g', 'g', 'g'],
        ['g', 'g', 'g', 'c']
      )
    });
    expect(gamemanager.getMatchingCols()).toMatchSnapshot();
  });

  it('can get matching cols when some are null', () => {
    const gamemanager = new GameManager({ boardSize: 4 });
    expect(
      gamemanager.getMatchingCols(
        generateSeedsNullable(
          ['b', 'c', 'g', 'g'],
          ['b', null, 'g', null],
          ['b', 'g', 'g', 'g'],
          ['g', 'g', 'g', 'c']
        )
      )
    ).toMatchSnapshot();
  });

  it('returns empty array if no matches', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(
        ['b', 'c', 'g', 'g'],
        ['c', 'b', 'g', 'c'],
        ['b', 'g', 'b', 'g'],
        ['g', 'c', 'g', 'c']
      )
    });
    expect(gamemanager.getMatchingCols()).toEqual([]);
  });
});

describe('when matching rows', () => {
  it('can get matching rows', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(
        ['b', 'b', 'b', 'g'],
        ['c', 'b', 'g', 'g'],
        ['g', 'g', 'g', 'g'],
        ['g', 'c', 'g', 'c']
      )
    });
    expect(gamemanager.getMatchingRows()).toMatchSnapshot();
  });

  it('can get matching rows when some are null', () => {
    const gamemanager = new GameManager({ boardSize: 4 });
    expect(
      gamemanager.getMatchingRows(
        generateSeedsNullable(
          ['b', 'b', 'b', 'g'],
          [null, 'b', null, 'g'],
          ['g', 'g', 'g', 'g'],
          ['g', 'c', 'g', 'c']
        )
      )
    ).toMatchSnapshot();
  });

  it('returns empty array if no matches', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(
        ['b', 'c', 'g', 'g'],
        ['c', 'b', 'g', 'c'],
        ['b', 'g', 'b', 'g'],
        ['g', 'c', 'g', 'c']
      )
    });
    expect(gamemanager.getMatchingRows()).toEqual([]);
  });
});

describe('when getting matching for both rows and cols', () => {
  it('can get valid matchings', () => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(
        ['b', 'c', 'b', 'g'],
        ['c', 'c', 'g', 'g'],
        ['g', 'c', 'g', 'c'],
        ['g', 'c', 'g', 'c']
      )
    });
    expect(gamemanager.getMatching()).toMatchSnapshot();
  });

  it('handles some seeds being null', () => {
    const gamemanager = new GameManager({ boardSize: 4 });
    expect(
      gamemanager.getMatching(
        generateSeedsNullable(
          ['b', 'c', 'b', 'g'],
          [null, 'c', null, 'g'],
          ['g', 'c', 'g', 'c'],
          ['g', 'c', 'g', 'c']
        )
      )
    ).toMatchSnapshot();
  });
});

it.each`
  col  | row  | targetCol | targetRow | isValid
  ${0} | ${0} | ${1}      | ${0}      | ${true}
  ${0} | ${2} | ${0}      | ${3}      | ${false}
  ${0} | ${0} | ${0}      | ${0}      | ${false}
  ${0} | ${0} | ${1}      | ${1}      | ${false}
  ${0} | ${0} | ${2}      | ${0}      | ${false}
  ${0} | ${0} | ${0}      | ${2}      | ${false}
`(
  'when trying move from ($col, $row) to ($targetCol, $targetRow), valid should be $isValid',
  ({ col, row, targetCol, targetRow, isValid }) => {
    const gamemanager = new GameManager({
      seeds: generateSeeds(
        ['b', 'c', 'b', 'g'],
        ['c', 'b', 'b', 'g'],
        ['g', 'c', 'g', 'c'],
        ['g', 'b', 'g', 'c']
      )
    });
    const result = gamemanager.tryMove({ col, row, targetCol, targetRow });
    expect(result.move.isValid).toEqual(isValid);
    expect(result).toMatchSnapshot();
  }
);

describe('when spawning new seeds', () => {
  it('can spawn new seeds to fill missing cells', () => {
    const gamemanager = new GameManager({
      boardSize: 4,
      minMatch: 3
    });
    const originalSeeds = generateSeedsNullable(
      ['b', 'c', null, 'g'],
      ['c', 'b', 'b', 'g'],
      [null, null, 'g', 'c'],
      ['g', 'b', null, null]
    );
    const newSeeds = gamemanager.spawnSeeds({ seeds: originalSeeds });
    expect(
      newSeeds.every((col, i) =>
        col.every(
          (seed, j) =>
            seed &&
            (originalSeeds[i][j] === null ||
              _.isEqual(originalSeeds[i][j], seed))
        )
      )
    ).toBeTruthy();
  });

  it('can spawn new seeds when matching is not allowed', () => {
    const gamemanager = new GameManager({
      boardSize: 4,
      minMatch: 3
    });
    const originalSeeds = generateSeedsNullable(
      ['b', 'c', null, 'g'],
      ['c', 'b', 'b', 'g'],
      [null, null, 'g', 'c'],
      ['g', 'b', null, null]
    );
    const newSeeds = gamemanager.spawnSeeds({
      seeds: originalSeeds,
      allowMatching: false
    });
    expect(gamemanager.getMatching(newSeeds).length).toEqual(0);
    expect(
      newSeeds.every((col, i) =>
        col.every(
          (seed, j) =>
            seed &&
            (originalSeeds[i][j] === null ||
              _.isEqual(originalSeeds[i][j], seed))
        )
      )
    ).toBeTruthy();
  });

  it('can spawn new seeds on board init', () => {
    const gamemanager = new GameManager();
    expect(gamemanager.getMatching().length).toEqual(0);
    expect(gamemanager.seeds.length).toEqual(10);
    gamemanager.seeds.every((col) => expect(col.length).toEqual(10));
    expect(
      gamemanager.seeds.every((col) => col.every((seed) => seed))
    ).toBeTruthy();
    expect(gamemanager.hasMove().length).toBeTruthy();
  });
});
