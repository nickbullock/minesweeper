import React, { FormEvent, useCallback, useState } from 'react';

import './global.css';
import { MineSweeper } from './MineSweeper/MineSweeper';
import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROW_COUNT,
} from './MineSweeper/constants';
import { Form } from './Form/Form';
import {
  handleColumnCountInputValue,
  handleMineCountInputValue,
  handleRowCountInputValue,
} from './Form/utils';
import { MineSweeperSettings } from './MineSweeper/types';

function App() {
  const [rowCount, setRowCount] = useState(DEFAULT_ROW_COUNT.toString());
  const [columnCount, setColumnCount] = useState(DEFAULT_COLUMN_COUNT.toString());
  const [mineCount, setMineCount] = useState(DEFAULT_MINE_COUNT.toString());

  const [settings, setSettings] = useState<MineSweeperSettings>({
    rowCount: DEFAULT_ROW_COUNT,
    columnCount: DEFAULT_COLUMN_COUNT,
    mineCount: DEFAULT_MINE_COUNT,
  });

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const newSettings = {} as MineSweeperSettings;

      newSettings.rowCount = handleRowCountInputValue(rowCount);
      newSettings.columnCount = handleColumnCountInputValue(columnCount);

      const maxMineCount = newSettings.rowCount * newSettings.columnCount - 1;

      newSettings.mineCount = handleMineCountInputValue(mineCount, maxMineCount);

      setSettings(newSettings);
      setRowCount(newSettings.rowCount.toString());
      setColumnCount(newSettings.columnCount.toString());
      setMineCount(newSettings.mineCount.toString());
    },
    [rowCount, columnCount, mineCount],
  );

  const onRowCountChange = useCallback(e => setRowCount(e.target.value), []);
  const onColumnCountChange = useCallback(e => setColumnCount(e.target.value), []);
  const onMineCountChange = useCallback(e => setMineCount(e.target.value), []);

  return (
    <div className="app">
      <Form
        rowCount={rowCount}
        columnCount={columnCount}
        mineCount={mineCount}
        onRowCountChange={onRowCountChange}
        onColumnCountChange={onColumnCountChange}
        onMineCountChange={onMineCountChange}
        onSubmit={onSubmit}
      />
      <MineSweeper settings={settings} className="mt-10" />
    </div>
  );
}

export default App;
