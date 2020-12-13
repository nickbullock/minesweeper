import React, { useCallback, useEffect, useState } from 'react';
import './global.css';
import Modal from 'react-modal';

import { MineSweeper } from './MineSweeper/MineSweeper';
import { MineSweeperSettings } from './MineSweeper/types';
import { SettingsModal } from './SettingsModal/SettingsModal';
import { Difficulty, FormSubmitData } from './SettingsModal/Form/types';
import { LEVELS } from './SettingsModal/Form/constants';
import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROW_COUNT,
} from './MineSweeper/constants';

Modal.setAppElement('#root');

const storageKey = 'MineSweeperLevel';

function App() {
  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

  const [level, setLevel] = useState(
    (localStorage.getItem(storageKey) as Difficulty) || Difficulty.Beginner,
  );

  const [settings, setSettings] = useState<MineSweeperSettings>({
    rowCount: level === Difficulty.Custom ? DEFAULT_ROW_COUNT : LEVELS[level].rowCount,
    columnCount: level === Difficulty.Custom ? DEFAULT_COLUMN_COUNT : LEVELS[level].columnCount,
    mineCount: level === Difficulty.Custom ? DEFAULT_MINE_COUNT : LEVELS[level].mineCount,
  });

  const onSettingsClick = useCallback(() => setIsSettingsOpened(opened => !opened), []);

  const onSubmit = useCallback(({ settings, level }: FormSubmitData) => {
    setLevel(level);
    setIsSettingsOpened(false);
    setSettings(settings);
  }, []);

  useEffect(() => {
    if (level !== Difficulty.Custom) {
      localStorage.setItem(storageKey, level);
    }
  }, [level]);

  return (
    <div className="app column">
      <div className="row">
        <button className="m-auto" onClick={onSettingsClick}>
          Settings
        </button>
      </div>
      <MineSweeper settings={settings} className="minesweeper" />
      <SettingsModal
        level={level}
        rowCount={settings.rowCount.toString()}
        columnCount={settings.columnCount.toString()}
        mineCount={settings.mineCount.toString()}
        isOpen={isSettingsOpened}
        onRequestClose={onSettingsClick}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default App;
