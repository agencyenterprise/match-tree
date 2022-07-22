import { GameManager } from './GameManager';
it('create a board and inits a board', () => {
  const gamemanager = new GameManager(10);
  expect(gamemanager.boardSize).toEqual(10);
  expect(gamemanager.seeds.length).toEqual(10);
  expect(gamemanager.seeds[9].length).toEqual(10);
  console.log(gamemanager.seeds)
});

it('can override init seeds', () => {
  const gamemanager = new GameManager(0, [
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
  ]);
  expect(gamemanager.boardSize).toEqual(3);
  expect(gamemanager.seeds.length).toEqual(3);
  expect(gamemanager.seeds[2].length).toEqual(3);
});
