import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROW_COUNT,
  MIN_COLUMN_COUNT,
  MIN_MINE_COUNT,
  MIN_ROW_COUNT,
} from '../constants';
import { CellView, GameStatus } from '../types';
import { randomInt } from '../../test-utils';
import { getKey, parseKey, shuffle } from '../../utils';

import { Processor } from './Processor';

const createNewProcessor = (
  rowCount = DEFAULT_ROW_COUNT,
  columnCount = DEFAULT_COLUMN_COUNT,
  mineCount = DEFAULT_MINE_COUNT,
) => new Processor(rowCount, columnCount, mineCount);

describe('Processor', () => {
  it('should be initialized with the "not started" state', () => {
    const processor = createNewProcessor();

    expect(processor.getGameStatus() === GameStatus.NotStarted).toBe(true);

    processor.init();

    expect(processor.getGameStatus() === GameStatus.NotStarted).toBe(true);
  });

  it('should create the empty board', () => {
    const processor = createNewProcessor(MIN_ROW_COUNT, MIN_COLUMN_COUNT, MIN_MINE_COUNT);

    processor.init();

    expect(processor.getBoard()).toEqual({
      [`0-0`]: CellView.Blank,
      [`0-1`]: CellView.Blank,
      [`0-2`]: CellView.Blank,
      [`0-3`]: CellView.Blank,
      [`0-4`]: CellView.Blank,
      [`0-5`]: CellView.Blank,
      [`0-6`]: CellView.Blank,
      [`0-7`]: CellView.Blank,
    });
  });

  it('should open the cell', () => {
    const processor = createNewProcessor();
    const x = randomInt(0, DEFAULT_ROW_COUNT - 1);
    const y = randomInt(0, DEFAULT_COLUMN_COUNT - 1);

    processor.init();
    processor.open(x, y);

    expect(processor.getBoard()[getKey(x, y)] === CellView.Open).toBe(true);
  });

  it('should set the flag and reset the flag', () => {
    const processor = createNewProcessor();
    const x = randomInt(0, DEFAULT_ROW_COUNT - 1);
    const y = randomInt(0, DEFAULT_COLUMN_COUNT - 1);

    processor.init();
    processor.flag(x, y);

    expect(processor.getBoard()[getKey(x, y)] === CellView.MineFlagged).toBe(true);

    processor.flag(x, y);

    expect(processor.getBoard()[getKey(x, y)] === CellView.Blank).toBe(true);
  });

  it('should never explode the player on his first turn', () => {
    let exploded = false;

    for (let i = 0; i < 1000; i++) {
      const processor = createNewProcessor();
      const x = randomInt(0, DEFAULT_ROW_COUNT - 1);
      const y = randomInt(0, DEFAULT_COLUMN_COUNT - 1);

      processor.init();
      processor.open(x, y);

      if (processor.getGameStatus() === GameStatus.Lose) {
        exploded = true;
        break;
      }
    }

    expect(exploded).toBe(false);
  });

  it('should explode the player if he clicks the mine', () => {
    const mineFreeCellsCount = 2;

    const processor = createNewProcessor(
      DEFAULT_ROW_COUNT,
      DEFAULT_COLUMN_COUNT,
      DEFAULT_ROW_COUNT * DEFAULT_COLUMN_COUNT - mineFreeCellsCount,
    );

    const firstClickX = randomInt(mineFreeCellsCount, DEFAULT_ROW_COUNT - 1 - mineFreeCellsCount);

    const firstClickY = randomInt(
      mineFreeCellsCount,
      DEFAULT_COLUMN_COUNT - 1 - mineFreeCellsCount,
    );

    processor.init();
    processor.open(firstClickX, firstClickY);

    // to test that wrong flags will be marked when the game will be over
    processor.flag(firstClickX - 1, firstClickY - 1);
    processor.flag(firstClickX, firstClickY - 1);
    processor.flag(firstClickX + 1, firstClickY - 1);
    processor.flag(firstClickX - 1, firstClickY);
    processor.flag(firstClickX + 1, firstClickY);
    processor.flag(firstClickX - 1, firstClickY + 1);
    processor.flag(firstClickX, firstClickY + 1);
    processor.flag(firstClickX + 1, firstClickY + 1);

    expect(processor.getGameStatus() === GameStatus.InProgress).toBe(true);

    const [secondClickX] = shuffle([0, DEFAULT_ROW_COUNT - 1]).slice(0, 1);
    const [secondClickY] = [0, DEFAULT_COLUMN_COUNT - 1].slice(0, 1);

    processor.open(secondClickX, secondClickY);

    expect(processor.getGameStatus() === GameStatus.Lose).toBe(true);
  });

  it('should reset the board', () => {
    const processor = createNewProcessor();

    expect(processor.getBoard()).toEqual({});

    processor.init();

    expect(processor.getBoard()).not.toEqual({});

    processor.reset();

    expect(processor.getBoard()).toEqual({});
  });

  it('should not let the player to open or put the flag on the opened cell', () => {
    const processor = createNewProcessor();
    const x = randomInt(0, DEFAULT_ROW_COUNT - 1);
    const y = randomInt(0, DEFAULT_COLUMN_COUNT - 1);

    processor.init();

    expect(processor.getBoard()[getKey(x, y)] === CellView.Blank).toBe(true);

    processor.open(x, y);

    expect(processor.getBoard()[getKey(x, y)] === CellView.Open).toBe(true);

    processor.open(x, y);

    expect(processor.getBoard()[getKey(x, y)] === CellView.Open).toBe(true);

    processor.flag(x, y);

    expect(processor.getBoard()[getKey(x, y)] === CellView.Open).toBe(true);
  });

  it('should not let the player to put more flags than there are mines', () => {
    const mineCount = randomInt(MIN_MINE_COUNT, DEFAULT_ROW_COUNT * DEFAULT_MINE_COUNT - 1);
    const processor = createNewProcessor(DEFAULT_ROW_COUNT, DEFAULT_MINE_COUNT, mineCount);

    processor.init();

    Object.keys(processor.getBoard()).forEach((key, index) => {
      const { x, y } = parseKey(key);

      processor.flag(x, y);
    });

    const flagCount = Object.keys(processor.getBoard()).reduce(
      (res, key) => (processor.getBoard()[key] === CellView.MineFlagged ? res + 1 : res),
      0,
    );

    expect(processor.getFlagRemainingCount()).toBe(0);
    expect(flagCount).not.toBeGreaterThan(mineCount);
  });

  it('should not let the player to open or flag the cell that is out of bounds', () => {
    const processor = createNewProcessor();
    const [x] = shuffle([-1, DEFAULT_ROW_COUNT]);
    const [y] = shuffle([-1, DEFAULT_COLUMN_COUNT]);

    processor.init();

    const initialBoard = { ...processor.getBoard() };

    processor.open(x, y);

    expect(processor.getBoard()).toEqual(initialBoard);

    processor.flag(x, y);

    expect(processor.getBoard()).toEqual(initialBoard);
  });

  it('should not let the player to open or flag the cell if the game is finished', () => {
    const processor = createNewProcessor();
    const x = randomInt(0, DEFAULT_ROW_COUNT - 1);
    const y = randomInt(0, DEFAULT_COLUMN_COUNT - 1);

    processor.init();

    const initialBoard = { ...processor.getBoard() };

    (processor as any).gameStatus = shuffle([GameStatus.Lose, GameStatus.Win])[0];

    processor.open(x, y);

    expect(processor.getBoard()).toEqual(initialBoard);

    processor.flag(x, y);

    expect(processor.getBoard()).toEqual(initialBoard);
  });

  it('should let the player win on his first turn if there is 1 mine only', () => {
    const processor = createNewProcessor(DEFAULT_ROW_COUNT, DEFAULT_MINE_COUNT, 1);
    let x = randomInt(2, DEFAULT_ROW_COUNT - 1);
    let y = randomInt(2, DEFAULT_COLUMN_COUNT - 1);

    processor.init();

    (processor as any).anyCellOpened = true;
    (processor as any).setMine(0, 0);

    processor.open(x, y);

    expect(processor.getGameStatus() === GameStatus.Win).toBe(true);
  });
});
