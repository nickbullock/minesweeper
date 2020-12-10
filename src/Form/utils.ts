import { clamp } from '../utils';
import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROW_COUNT,
  MAX_COLUMN_COUNT,
  MAX_ROW_COUNT,
  MIN_COLUMN_COUNT,
  MIN_MINE_COUNT,
  MIN_ROW_COUNT,
} from '../MineSweeper/constants';

const handleInputValue = (value: string, min: number, max: number, defaultValue: number) => {
  let num = parseInt(value, 10);

  if (!num || isNaN(num)) {
    num = defaultValue;
  } else {
    num = clamp(num, min, max);
  }

  return num;
};

export const handleRowCountInputValue = (value: string) =>
  handleInputValue(value, MIN_ROW_COUNT, MAX_ROW_COUNT, DEFAULT_ROW_COUNT);
export const handleColumnCountInputValue = (value: string) =>
  handleInputValue(value, MIN_COLUMN_COUNT, MAX_COLUMN_COUNT, DEFAULT_COLUMN_COUNT);
export const handleMineCountInputValue = (value: string, max: number) =>
  handleInputValue(value, MIN_MINE_COUNT, max, DEFAULT_MINE_COUNT);
