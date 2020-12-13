import React, { ChangeEvent, FC, FormEvent, memo, useCallback, useState } from 'react';

import { MineSweeperSettings } from '../../MineSweeper/types';
import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROW_COUNT,
} from '../../MineSweeper/constants';

import { LEVELS } from './constants';
import { Difficulty, FormSubmitData } from './types';
import {
  handleColumnCountInputValue,
  handleMineCountInputValue,
  handleRowCountInputValue,
} from './utils';

export interface FormProps {
  level: Difficulty;
  rowCount: string;
  columnCount: string;
  mineCount: string;
  onSubmit: (data: FormSubmitData) => void;
  onCancel?: any;
}

export const Form: FC<FormProps> = memo(props => {
  const {
    level,
    rowCount: defaultRowCount,
    columnCount: defaultColumnCount,
    mineCount: defaultMineCount,
    onSubmit,
    onCancel,
  } = props;

  const [rowCount, setRowCount] = useState(
    level === Difficulty.Custom ? defaultRowCount : DEFAULT_ROW_COUNT.toString(),
  );

  const [columnCount, setColumnCount] = useState(
    level === Difficulty.Custom ? defaultColumnCount : DEFAULT_COLUMN_COUNT.toString(),
  );

  const [mineCount, setMineCount] = useState(
    level === Difficulty.Custom ? defaultMineCount : DEFAULT_MINE_COUNT.toString(),
  );

  const onRowCountChange = useCallback(e => setRowCount(e.target.value), []);
  const onColumnCountChange = useCallback(e => setColumnCount(e.target.value), []);
  const onMineCountChange = useCallback(e => setMineCount(e.target.value), []);

  const [selectedLevel, setSelectedLevel] = useState(level);

  const onSubmitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let newSettings = {} as MineSweeperSettings;

      if (selectedLevel === Difficulty.Custom) {
        newSettings.rowCount = handleRowCountInputValue(rowCount);
        newSettings.columnCount = handleColumnCountInputValue(columnCount);

        const maxMineCount = newSettings.rowCount * newSettings.columnCount - 1;

        newSettings.mineCount = handleMineCountInputValue(mineCount, maxMineCount);
      } else {
        newSettings = { ...LEVELS[selectedLevel] };
      }

      onSubmit({ settings: newSettings, level: selectedLevel });
    },
    [onSubmit, rowCount, columnCount, mineCount, selectedLevel],
  );

  const onLevelChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newLevelName = e.target.name as Difficulty;

    setSelectedLevel(newLevelName);
  }, []);

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="field-row">
        <div className="flex-1">Difficulty</div>
        <div className="flex-1">Rows</div>
        <div className="flex-1">Columns</div>
        <div className="flex-1">Mines</div>
      </div>
      {Object.keys(LEVELS).map(levelName => {
        const level = LEVELS[levelName];

        return (
          <div key={levelName} className="field-row">
            <div className="flex-1">
              <input
                id={levelName}
                type="radio"
                name={levelName}
                checked={selectedLevel === levelName}
                onChange={onLevelChange}
              />
              <label htmlFor={levelName}>{levelName}</label>
            </div>
            <div className="flex-1">{level.rowCount}</div>
            <div className="flex-1">{level.columnCount}</div>
            <div className="flex-1">{level.mineCount}</div>
          </div>
        );
      })}
      <div className="field-row">
        <div className="flex-1">
          <input
            id="Custom"
            type="radio"
            name="Custom"
            checked={selectedLevel === Difficulty.Custom}
            onChange={onLevelChange}
          />
          <label htmlFor="Custom">Custom</label>
        </div>
        <div className="flex-1">
          <input
            id="rowCount"
            type="text"
            value={rowCount}
            onChange={onRowCountChange}
            className="input"
            autoComplete="off"
            disabled={selectedLevel !== Difficulty.Custom}
          />
        </div>
        <div className="flex-1">
          <input
            id="columnCount"
            type="text"
            value={columnCount}
            onChange={onColumnCountChange}
            className="input"
            autoComplete="off"
            disabled={selectedLevel !== Difficulty.Custom}
          />
        </div>
        <div className="flex-1">
          <input
            id="mineCount"
            type="text"
            value={mineCount}
            onChange={onMineCountChange}
            className="input"
            autoComplete="off"
            disabled={selectedLevel !== Difficulty.Custom}
          />
        </div>
      </div>
      <div className="controls mt-10">
        <button type="submit">New game</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
});
