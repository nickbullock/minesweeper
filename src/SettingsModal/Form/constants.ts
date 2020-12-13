import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROW_COUNT,
} from '../../MineSweeper/constants';
import { MineSweeperSettings } from '../../MineSweeper/types';

import { Difficulty } from './types';

export const LEVELS: Record<string, MineSweeperSettings> = {
  [Difficulty.Beginner]: {
    rowCount: DEFAULT_ROW_COUNT,
    columnCount: DEFAULT_COLUMN_COUNT,
    mineCount: DEFAULT_MINE_COUNT,
  },
  [Difficulty.Intermediate]: {
    rowCount: 16,
    columnCount: 16,
    mineCount: 40,
  },
  [Difficulty.Advanced]: {
    rowCount: 16,
    columnCount: 30,
    mineCount: 99,
  },
};
