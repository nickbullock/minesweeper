import { CellBoard, CellModel, CellView, CellViewBoard, GameStatus, XYKey } from '../types';
import { clamp, getKey, parseKey, shuffle } from '../../utils';
import { randomInt } from '../../test-utils';

const MINE_FREE_CELLS = 9;

export class Processor {
  constructor(rowCount: number, columnCount: number, mineCount: number) {
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.mineCount = mineCount;
    this.isBoardMoreThanHalfMined = this.mineCount > (this.rowCount * this.columnCount) / 2;
  }

  readonly columnCount: number;
  readonly rowCount: number;
  readonly mineCount: number;

  private anyCellOpened: boolean = false;
  private flagPositions: XYKey[] = [];
  private remainingBlankPositions: CellViewBoard = {};
  private mineBoard: CellBoard = {};
  private board: CellViewBoard = {};
  private gameStatus: GameStatus = GameStatus.NotStarted;
  private isBoardMoreThanHalfMined: boolean = false;

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
    const { board, mineBoard } = this.createBoards(this.isBoardMoreThanHalfMined);

    this.mineBoard = mineBoard;
    this.board = board;
    this.remainingBlankPositions = { ...board };
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
    const mine = this.mineBoard[key]?.mine;

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
    const mineFreeMap = this.getMineFreeCells(x, y);
    let startCount = 0;

    if (this.isBoardMoreThanHalfMined) {
      Object.keys(mineFreeMap).forEach(key => {
        const { x, y } = parseKey(key);

        if (this.mineBoard[key]?.mine) {
          this.resetMine(x, y);
          startCount += 1;
        }
      });
    }

    const endCount = this.isBoardMoreThanHalfMined
      ? this.rowCount * this.columnCount - this.mineCount
      : this.mineCount;

    while (startCount < endCount) {
      const x = randomInt(0, this.rowCount - 1);
      const y = randomInt(0, this.columnCount - 1);
      const key = getKey(x, y);

      if (this.isBoardMoreThanHalfMined) {
        if (this.mineBoard[key]?.mine) {
          this.resetMine(x, y);
          startCount++;
        }
      } else {
        if (!this.mineBoard[key]?.mine && !mineFreeMap[key]) {
          this.setMine(x, y);
          startCount++;
        }
      }
    }
  }

  private setMine(x: number, y: number) {
    const key = getKey(x, y);

    this.mineBoard[key] = this.createCell(true);
    this.incrementAdjacentCellMineCount(this.mineBoard, x, y);
  }

  private resetMine(x: number, y: number) {
    const key = getKey(x, y);
    const root = this.mineBoard[key];

    if (root) {
      root.mine = false;
      this.decrementAdjacentCellMineCount(this.mineBoard, x, y);
    }
  }

  private incrementAdjacentCellMineCount(board: CellBoard = this.mineBoard, x: number, y: number) {
    Object.keys(this.getAdjacentCells(x, y)).forEach(key => {
      const root = board[key];

      if (root) {
        root.adjacentCellMineCount += 1;
      } else {
        board[key] = this.createCell(false, 1);
      }
    });
  }

  private decrementAdjacentCellMineCount(board: CellBoard = this.mineBoard, x: number, y: number) {
    Object.keys(this.getAdjacentCells(x, y)).forEach(key => {
      const root = board[key];

      if (root) {
        root.adjacentCellMineCount -= 1;
      } else {
        const adjacentCells = this.getAdjacentCells(x, y);

        const adjacentCellMineCount = Object.keys(adjacentCells).filter(
          key => !!this.mineBoard[key]?.mine,
        ).length;

        board[key] = this.createCell(false, adjacentCellMineCount);
      }
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
      const adjacentCellMineCount = this.mineBoard[key]?.adjacentCellMineCount || 0;

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

  private getAdjacentCells(x: number, y: number): Record<XYKey, boolean | undefined> {
    const result = {} as Record<XYKey, boolean | undefined>;
    const self = getKey(x, y);

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        const newX = clamp(i, 0, this.rowCount - 1);
        const newY = clamp(j, 0, this.columnCount - 1);
        const key = getKey(newX, newY);

        result[key] = true;
      }
    }

    delete result[self];

    return result;
  }

  private lose(key: XYKey): void {
    Object.keys(this.mineBoard).forEach(key => {
      if (this.mineBoard[key]?.mine && this.board[key] !== CellView.MineFlagged) {
        this.board[key] = CellView.MineRevealed;
      }
    });

    this.flagPositions.forEach(key => {
      if (this.board[key] === CellView.MineFlagged && !this.mineBoard[key]?.mine) {
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

    Object.keys(this.mineBoard).forEach(key => {
      if (this.mineBoard[key]?.mine) {
        this.flagPositions.push(key);
        this.board[key] = CellView.MineFlagged;
      }
    });

    this.gameStatus = GameStatus.Win;
  }

  private isGameFinished(): boolean {
    return this.getGameStatus() === GameStatus.Lose || this.getGameStatus() === GameStatus.Win;
  }

  private createBoards(mine = false): { board: CellViewBoard; mineBoard: CellBoard } {
    const board: CellViewBoard = {};
    const mineBoard: CellBoard = {};

    for (let x = 0; x < this.rowCount; x++) {
      for (let y = 0; y < this.columnCount; y++) {
        const key = getKey(x, y);

        board[key] = CellView.Blank;

        if (mine) {
          const adjacentCells = this.getAdjacentCells(x, y);
          const adjacentCellCount = Object.keys(adjacentCells).length;

          mineBoard[key] = this.createCell(mine, adjacentCellCount);
        }
      }
    }

    return { board, mineBoard };
  }

  private createCell(mine = false, adjacentCellMineCount = 0): CellModel {
    return { mine, adjacentCellMineCount };
  }

  private isCellOutOfBounds(x: number, y: number) {
    return x < 0 || y < 0 || x > this.rowCount - 1 || y > this.columnCount - 1;
  }
}
