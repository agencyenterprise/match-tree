import { GameManager } from './GameManager';
import * as _ from 'lodash';
import { SeedType } from './interfaces';

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

const generateSeeds = (...types: ('b' | 'c' | 'g')[][]) =>
  types.map((col, i) =>
    col.map((type, j) => ({
      col: i,
      row: j,
      type: shorthandTypeToSeedType(type)
    }))
  );

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

it('create a board and inits a board', () => {
  const gamemanager = new GameManager({ boardSize: 10 });
  expect(gamemanager.boardSize).toEqual(10);
  expect(gamemanager.seeds.length).toEqual(10);
  expect(gamemanager.seeds[9].length).toEqual(10);
});

it('can override init seeds', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: generateSeeds(['b', 'b', 'b'], ['c', 'g', 'b'], ['b', 'g', 'c'])
  });
  expect(gamemanager.boardSize).toEqual(3);
  expect(gamemanager.seeds.length).toEqual(3);
  expect(gamemanager.seeds[2].length).toEqual(3);
});

it('has cols and rows arranged correctly', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: generateSeeds(['c', 'c', 'c'], ['c', 'g', 'b'], ['c', 'g', 'c'])
  });
  expect(gamemanager.seeds[1][2].type).toEqual('black');
});

describe('when matching cols', () => {
  it('can get matching cols', () => {
    const gamemanager = new GameManager({
      boardSize: 0,
      minMatch: 3,
      seeds: generateSeeds(
        ['b', 'c', 'g', 'g'],
        ['b', 'b', 'g', 'c'],
        ['b', 'g', 'g', 'g'],
        ['g', 'g', 'g', 'c']
      )
    });
    expect(gamemanager.getMatchingCols()).toEqual([
      { col: 0, row: 0, type: 'black' },
      { col: 1, row: 0, type: 'black' },
      { col: 2, row: 0, type: 'black' },
      { col: 0, row: 2, type: 'green' },
      { col: 1, row: 2, type: 'green' },
      { col: 2, row: 2, type: 'green' },
      { col: 3, row: 2, type: 'green' }
    ]);
  });

  it('returns empty array if no matches', () => {
    const gamemanager = new GameManager({
      boardSize: 0,
      minMatch: 3,
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

it('can get matching rows', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: generateSeeds(
      ['b', 'b', 'b', 'g'],
      ['c', 'b', 'g', 'g'],
      ['g', 'g', 'g', 'g'],
      ['g', 'c', 'g', 'c']
    )
  });
  expect(gamemanager.getMatchingRows()).toEqual([
    { col: 0, row: 0, type: 'black' },
    { col: 0, row: 1, type: 'black' },
    { col: 0, row: 2, type: 'black' },
    { col: 2, row: 0, type: 'green' },
    { col: 2, row: 1, type: 'green' },
    { col: 2, row: 2, type: 'green' },
    { col: 2, row: 3, type: 'green' }
  ]);
});

it('can get matching for both rows and cols', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: generateSeeds(
      ['b', 'c', 'b', 'g'],
      ['c', 'c', 'g', 'g'],
      ['g', 'c', 'g', 'c'],
      ['g', 'c', 'g', 'c']
    )
  });
  expect(gamemanager.getMatching()).toEqual([
    { col: 0, row: 1, type: 'corn' },
    { col: 1, row: 1, type: 'corn' },
    { col: 2, row: 1, type: 'corn' },
    { col: 3, row: 1, type: 'corn' },
    { col: 1, row: 2, type: 'green' },
    { col: 2, row: 2, type: 'green' },
    { col: 3, row: 2, type: 'green' }
  ]);
});

it('can try a valid move', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: generateSeeds(
      ['b', 'c', 'b', 'g'],
      ['c', 'b', 'b', 'g'],
      ['g', 'c', 'g', 'c'],
      ['g', 'b', 'g', 'c']
    )
  });
  expect(
    gamemanager.tryMove({
      col: 0,
      row: 0,
      targetCol: 1,
      targetRow: 0
    })
  ).toEqual({
    move: { col: 0, row: 0, targetCol: 1, targetRow: 0, isValid: true },
    matching: {
      seeds: [
        { col: 1, row: 0, type: 'black' },
        { col: 1, row: 1, type: 'black' },
        { col: 1, row: 2, type: 'black' }
      ]
    }
  });
});

it('try move finds a valid move', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 2,
    seeds: generateSeeds(['b', 'c'], ['c', 'b'])
  });

  const moves = gamemanager.hasMove();
  console.log(JSON.stringify(moves));
});

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
          (originalSeeds[i][j] === null || _.isEqual(originalSeeds[i][j], seed))
      )
    )
  ).toBeTruthy();
});
