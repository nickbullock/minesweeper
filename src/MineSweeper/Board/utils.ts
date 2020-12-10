import { CellViewBoard, RowsWithCells } from '../types';
import { parseKey } from '../../utils';

export const mapBoardToRowsWithCells = (board: CellViewBoard): RowsWithCells => {
  return Object.keys(board).reduce((res, key, index) => {
    const { x } = parseKey(key);

    const cell = {
      key,
      view: board[key],
    };

    if (res[x]) {
      res[x] = [...res[x], cell];
    } else {
      res[x] = [cell];
    }

    return res;
  }, [] as RowsWithCells);
};
