import React, { FC, memo, useEffect, useState } from 'react';

import { CellBoard, CellViewBoard, RowsWithCells } from '../types';

import { Cell } from './Cell/Cell';
import { mapBoardToRowsWithCells } from './utils';

export interface BoardProps {
  board: CellViewBoard;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number) => void;
}

export const Board: FC<BoardProps> = memo(props => {
  const { board, onCellClick, onCellRightClick } = props;
  const [rowsWithCells, setRowsWithCells] = useState<RowsWithCells>([]);

  useEffect(() => {
    const rowsWithCells = mapBoardToRowsWithCells(board);

    setRowsWithCells(rowsWithCells);
  }, [board]);

  return (
    <div className="column">
      {rowsWithCells?.map((row, index) => {
        return (
          <div className="row" key={index}>
            {row.map(cell => {
              return (
                <Cell
                  id={cell.key}
                  {...cell}
                  onClick={onCellClick}
                  onRightClick={onCellRightClick}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
});
