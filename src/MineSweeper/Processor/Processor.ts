import { CellBoard, CellModel, CellView, CellViewBoard, GameStatus, XYKey } from '../types';
import { clamp, getKey, parseKey, shuffle } from '../../utils';
import { randomInt } from '../../test-utils';

const MINE_FREE_CELLS = 9;

/**
 * @overview
 * Processor class keeps all the rules of minesweeper game
 * Created to contain the game logic only and have opportunity
 * to easily separate it from UI to backend or web-worker
 * */
export class Processor {
  constructor(rowCount: number, columnCount: number, mineCount: number) {
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.mineCount = mineCount;
  }

  readonly columnCount: number;
  readonly rowCount: number;
  readonly mineCount: number;

  private anyCellOpened: boolean = false;
  private minePositions: XYKey[] = [];
  private flagPositions: XYKey[] = [];
  private remainingBlankPositions: CellBoard = {};
  private mineBoard: CellBoard = {};
  private board: CellViewBoard = {};
  private gameStatus: GameStatus = GameStatus.NotStarted;

  public getBoard(): CellViewBoard {
    return this.board;
  }

  public getGameStatus(): GameStatus {
    return this.gameStatus;
  }

  public getFlagRemainingCount(): number {
    return this.mineCount - this.flagPositions.length;
  }

  public init(): void {
    const { board, mineBoard } = this.createBoards();

    this.mineBoard = mineBoard;
    this.board = board;
    this.remainingBlankPositions = { ...mineBoard };
  }

  public reset(): void {
    this.board = {};
    this.mineBoard = {};
    this.anyCellOpened = false;
  }

  public open(x: number, y: number): void {
    if (this.isGameFinished()) return;
    if (this.isCellOutOfBounds(x, y)) return;

    const key = getKey(x, y);
    const view = this.board[key];
    const { mine } = this.mineBoard[key];

    if (view.startsWith('open')) return;
    if (this.anyCellOpened && mine) return this.lose(key);

    if (!this.anyCellOpened) {
      this.setMines(x, y);
      this.anyCellOpened = true;
      this.gameStatus = GameStatus.InProgress;
    }

    this.openClosestCellsUntilNumber(x, y);
    this.checkForWin();
  }

  public flag(x: number, y: number): void {
    if (this.isGameFinished()) return;
    if (this.isCellOutOfBounds(x, y)) return;

    const key = getKey(x, y);

    if (this.board[key] === CellView.Blank) {
      if (!this.getFlagRemainingCount()) return;
      this.board[key] = CellView.MineFlagged;
      this.flagPositions.push(key);
    } else if (this.board[key] === CellView.MineFlagged) {
      this.board[key] = CellView.Blank;
      this.flagPositions.splice(this.flagPositions.indexOf(key), 1);
    }

    this.checkForWin();
  }

  private getMineFreeCells(x: number, y: number): Record<XYKey, CellModel | undefined> {
    const key = getKey(x, y);
    const freeCells = this.columnCount * this.rowCount - this.mineCount;
    const excludedCells = freeCells >= MINE_FREE_CELLS ? MINE_FREE_CELLS : freeCells;
    const adjacentCells = this.getAdjacentCells(x, y);
    const adjacentCellKeys = Object.keys(adjacentCells);

    let result;

    if (adjacentCellKeys.length > excludedCells) {
      result = [key].concat(shuffle(adjacentCellKeys)).slice(0, excludedCells);
    } else {
      result = [key].concat(adjacentCellKeys);
    }

    return result.reduce((res, key) => {
      res[key] = this.createCell();

      return res;
    }, {} as Record<XYKey, CellModel | undefined>);
  }

  private setMines(x: number, y: number): void {
    const bombsFreeMap = this.getMineFreeCells(x, y);
    const map = this.createBoards().mineBoard;

    Object.keys(map).forEach(key => {
      if (bombsFreeMap[key]) {
        delete map[key];
      }
    });

    shuffle(Object.keys(map))
      .slice(0, this.mineCount)
      .forEach(key => {
        const { x, y } = parseKey(key);

        this.setMine(x, y);
      });
  }

  private setMine(x: number, y: number) {
    const key = getKey(x, y);

    this.minePositions.push(key);
    this.mineBoard[key].mine = true;
    this.incrementAdjacentCellMineCount(x, y);
  }

  private incrementAdjacentCellMineCount(x: number, y: number) {
    Object.keys(this.getAdjacentCells(x, y)).forEach(key => {
      this.mineBoard[key].adjacentCellMineCount += 1;
    });
  }

  private openClosestCellsUntilNumber(x: number, y: number) {
    const visitedAdjacentCells = {} as Record<XYKey, boolean | undefined>;
    const adjacentCells = {} as Record<XYKey, CellModel | undefined>;
    const getAdjacentCells = () => Object.keys(adjacentCells);
    const key = getKey(x, y);

    adjacentCells[key] = this.mineBoard[key];

    while (getAdjacentCells().length) {
      const [key] = getAdjacentCells();

      const { x, y } = parseKey(key);
      const { adjacentCellMineCount } = this.mineBoard[key];

      if (adjacentCellMineCount === 0) {
        this.board[key] = CellView.Open;

        const newAdjacentCells = this.getAdjacentCells(x, y);

        Object.keys(newAdjacentCells).forEach(key => {
          if (visitedAdjacentCells[key]) delete newAdjacentCells[key];
        });

        Object.assign(adjacentCells, newAdjacentCells);
      } else {
        this.board[key] = ('open' + adjacentCellMineCount) as CellView;
      }

      visitedAdjacentCells[key] = true;
      delete adjacentCells[key];
      delete this.remainingBlankPositions[key];
    }
  }

  private getAdjacentCells(x: number, y: number): Record<XYKey, CellModel | undefined> {
    const result = {} as Record<XYKey, CellModel | undefined>;
    const self = getKey(x, y);

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        const newX = clamp(i, 0, this.rowCount - 1);
        const newY = clamp(j, 0, this.columnCount - 1);
        const key = getKey(newX, newY);

        result[key] = this.mineBoard[key];
      }
    }

    delete result[self];

    return result;
  }

  private lose(key: XYKey): void {
    this.minePositions.forEach(key => {
      if (this.board[key] !== CellView.MineFlagged) {
        this.board[key] = CellView.MineRevealed;
      }
    });

    this.flagPositions.forEach(key => {
      if (this.board[key] === CellView.MineFlagged && !this.mineBoard[key].mine) {
        this.board[key] = CellView.MineWrongFlagged;
      }
    });

    this.board[key] = CellView.MineDeath;
    this.gameStatus = GameStatus.Lose;
  }

  private checkForWin(): void {
    const remainingBlankCellCount = Object.keys(this.remainingBlankPositions).length;

    if (remainingBlankCellCount === this.mineCount) {
      this.win();
    }
  }

  private win(): void {
    this.flagPositions = [];

    this.minePositions.forEach(key => {
      this.flagPositions.push(key);
      this.board[key] = CellView.MineFlagged;
    });

    this.gameStatus = GameStatus.Win;
  }

  private isGameFinished(): boolean {
    return this.getGameStatus() === GameStatus.Lose || this.getGameStatus() === GameStatus.Win;
  }

  private createBoards(): { board: CellViewBoard; mineBoard: CellBoard } {
    const board: CellViewBoard = {};
    const mineBoard: CellBoard = {};

    for (let x = 0; x < this.rowCount; x++) {
      for (let y = 0; y < this.columnCount; y++) {
        const key = getKey(x, y);

        board[key] = CellView.Blank;
        mineBoard[key] = this.createCell();
      }
    }

    return { board, mineBoard };
  }

  private createCell(): CellModel {
    return { mine: false, adjacentCellMineCount: 0 };
  }

  private isCellOutOfBounds(x: number, y: number) {
    return x < 0 || y < 0 || x > this.rowCount - 1 || y > this.columnCount - 1;
  }
}
