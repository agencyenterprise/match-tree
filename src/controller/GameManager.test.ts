import { GameManager } from './GameManager';
import { ISeed } from './interfaces';
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
    seeds: [
      [
        { col: 0, row: 0, type: 'black' },
        { col: 0, row: 1, type: 'black' },
        { col: 0, row: 1, type: 'black' }
      ],
      [
        { col: 0, row: 0, type: 'corn' },
        { col: 0, row: 1, type: 'green' },
        { col: 0, row: 1, type: 'black' }
      ],
      [
        { col: 0, row: 0, type: 'black' },
        { col: 0, row: 1, type: 'green' },
        { col: 0, row: 1, type: 'corn' }
      ]
    ]
  });
  expect(gamemanager.boardSize).toEqual(3);
  expect(gamemanager.seeds.length).toEqual(3);
  expect(gamemanager.seeds[2].length).toEqual(3);
});

it('has cols and rows arranged correctly', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: [
      [
        { col: 0, row: 0, type: 'corn' },
        { col: 0, row: 1, type: 'corn' },
        { col: 0, row: 1, type: 'corn' }
      ],
      [
        { col: 0, row: 0, type: 'corn' },
        { col: 0, row: 1, type: 'green' },
        { col: 0, row: 1, type: 'black' }
      ],
      [
        { col: 0, row: 0, type: 'corn' },
        { col: 0, row: 1, type: 'green' },
        { col: 0, row: 1, type: 'corn' }
      ]
    ]
  });
  expect(gamemanager.seeds[1][2].type).toEqual('black');
});

it('can get matching cols', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: [
      [
        { col: 0, row: 0, type: 'black' },
        { col: 0, row: 1, type: 'corn' },
        { col: 0, row: 2, type: 'green' },
        { col: 0, row: 3, type: 'green' }
      ],
      [
        { col: 1, row: 0, type: 'black' },
        { col: 1, row: 1, type: 'black' },
        { col: 1, row: 2, type: 'green' },
        { col: 1, row: 3, type: 'corn' }
      ],
      [
        { col: 2, row: 0, type: 'black' },
        { col: 2, row: 1, type: 'green' },
        { col: 2, row: 2, type: 'green' },
        { col: 2, row: 3, type: 'green' }
      ],
      [
        { col: 3, row: 0, type: 'green' },
        { col: 3, row: 1, type: 'green' },
        { col: 3, row: 2, type: 'green' },
        { col: 3, row: 3, type: 'corn' }
      ]
    ]
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

it('can get matching rows', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: [
      [
        { col: 0, row: 0, type: 'black' },
        { col: 0, row: 1, type: 'black' },
        { col: 0, row: 2, type: 'black' },
        { col: 0, row: 3, type: 'green' }
      ],
      [
        { col: 1, row: 0, type: 'corn' },
        { col: 1, row: 1, type: 'black' },
        { col: 1, row: 2, type: 'green' },
        { col: 1, row: 3, type: 'green' }
      ],
      [
        { col: 2, row: 0, type: 'green' },
        { col: 2, row: 1, type: 'green' },
        { col: 2, row: 2, type: 'green' },
        { col: 2, row: 3, type: 'green' }
      ],
      [
        { col: 3, row: 0, type: 'green' },
        { col: 3, row: 1, type: 'corn' },
        { col: 3, row: 2, type: 'green' },
        { col: 3, row: 3, type: 'corn' }
      ]
    ]
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

it('can get matching rows', () => {
  const gamemanager = new GameManager({
    boardSize: 0,
    minMatch: 3,
    seeds: [
      [
        { col: 0, row: 0, type: 'black' },
        { col: 0, row: 1, type: 'corn' },
        { col: 0, row: 2, type: 'black' },
        { col: 0, row: 3, type: 'green' }
      ],
      [
        { col: 1, row: 0, type: 'corn' },
        { col: 1, row: 1, type: 'corn' },
        { col: 1, row: 2, type: 'green' },
        { col: 1, row: 3, type: 'green' }
      ],
      [
        { col: 2, row: 0, type: 'green' },
        { col: 2, row: 1, type: 'corn' },
        { col: 2, row: 2, type: 'green' },
        { col: 2, row: 3, type: 'corn' }
      ],
      [
        { col: 3, row: 0, type: 'green' },
        { col: 3, row: 1, type: 'corn' },
        { col: 3, row: 2, type: 'green' },
        { col: 3, row: 3, type: 'corn' }
      ]
    ]
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
    seeds: [
      [
        { col: 0, row: 0, type: 'black' },
        { col: 0, row: 1, type: 'corn' },
        { col: 0, row: 2, type: 'black' },
        { col: 0, row: 3, type: 'green' }
      ],
      [
        { col: 1, row: 0, type: 'corn' },
        { col: 1, row: 1, type: 'black' },
        { col: 1, row: 2, type: 'black' },
        { col: 1, row: 3, type: 'green' }
      ],
      [
        { col: 2, row: 0, type: 'green' },
        { col: 2, row: 1, type: 'corn' },
        { col: 2, row: 2, type: 'green' },
        { col: 2, row: 3, type: 'corn' }
      ],
      [
        { col: 3, row: 0, type: 'green' },
        { col: 3, row: 1, type: 'black' },
        { col: 3, row: 2, type: 'green' },
        { col: 3, row: 3, type: 'corn' }
      ]
    ]
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
    seeds: [
      [
        { col: 0, row: 0, type: 'black' },
        { col: 0, row: 1, type: 'corn' }
      ],
      [
        { col: 1, row: 0, type: 'corn' },
        { col: 1, row: 1, type: 'black' }
      ]
    ]
  });

  const moves = gamemanager.hasMove();
  console.log(JSON.stringify(moves));
});
