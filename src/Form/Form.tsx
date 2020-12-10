import React, { ChangeEvent, FC, FormEvent, memo } from 'react';

export interface FormProps {
  rowCount: string;
  columnCount: string;
  mineCount: string;
  onRowCountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onColumnCountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMineCountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const Form: FC<FormProps> = memo(props => {
  const {
    rowCount,
    columnCount,
    mineCount,
    onRowCountChange,
    onColumnCountChange,
    onMineCountChange,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit}>
      <div className="row row-padded">
        <label htmlFor="rowCount">Rows</label>
        <input id="rowCount" type="text" value={rowCount} onChange={onRowCountChange} />
        <label htmlFor="columnCount">Columns</label>
        <input id="columnCount" type="text" value={columnCount} onChange={onColumnCountChange} />
        <label htmlFor="mineCount">Mines</label>
        <input id="mineCount" type="text" value={mineCount} onChange={onMineCountChange} />
        <div />
        <button type="submit">New game</button>
      </div>
    </form>
  );
});
