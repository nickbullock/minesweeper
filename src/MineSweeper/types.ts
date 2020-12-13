export enum GameStatus {
  NotStarted,
  InProgress,
  Win,
  Lose,
}

export interface MineSweeperSettings {
  columnCount: number;
  rowCount: number;
  mineCount: number;
}

export interface CellModel {
  mine: boolean;
  adjacentCellMineCount: number;
}

export enum CellView {
  MineFlagged = 'bombflagged',
  MineDeath = 'bombdeath',
  MineRevealed = 'bombrevealed',
  MineWrongFlagged = 'wrongflagged',
  Blank = 'blank',
  Open = 'open0',
  Open1 = 'open1',
  Open2 = 'open2',
  Open3 = 'open3',
  Open4 = 'open4',
  Open5 = 'open5',
  Open6 = 'open6',
  Open7 = 'open7',
  Open8 = 'open8',
}

export type XYKey = string;
export type CellBoard = Record<XYKey, CellModel | undefined>;
export type CellViewBoard = Record<XYKey, CellView>;
export type CellViewWithKey = { key: XYKey; view: CellView };
export type RowsWithCells = CellViewWithKey[][];
