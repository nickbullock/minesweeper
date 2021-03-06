import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import './MineSweeper.css';
import { Toolbar } from './Toolbar/Toolbar';
import { Board } from './Board/Board';
import { Layout } from './Layout/Layout';
import { CellViewBoard, GameStatus, MineSweeperSettings } from './types';
import { Processor } from './Processor/Processor';
import { VictoryModal } from './VictoryModal/VictoryModal';
import { getGiphyImage } from './utils';

export interface MineSweeperProps {
  settings: MineSweeperSettings;
  className?: string;
}

export const MineSweeper: FC<MineSweeperProps> = props => {
  const { settings, className } = props;
  const { rowCount, columnCount, mineCount } = settings;
  const [board, setBoard] = useState<CellViewBoard>({});
  const [gameStatus, setGameStatus] = useState(GameStatus.NotStarted);
  const [flagRemainingCount, setFlagRemainingCount] = useState(mineCount);
  const [time, setTime] = useState(0);
  const [isVictoryModalOpened, setIsVictoryModalOpened] = useState(false);
  const [victoryImage, setVictoryImage] = useState('');
  const timerRef = useRef<number | null>(null);
  const processorRef = useRef<Processor>(new Processor(rowCount, columnCount, mineCount));
  const innerGameStatus = processorRef.current.getGameStatus();
  const innerFlagRemainingCount = processorRef.current.getFlagRemainingCount();

  const toggleVictoryModal = useCallback(() => {
    setIsVictoryModalOpened(open => !open);
  }, [setIsVictoryModalOpened]);

  const incTime = useCallback(() => setTime(time => time + 1), []);

  const startTimer = useCallback(() => {
    incTime();

    timerRef.current = window.setInterval(() => {
      incTime();
    }, 1000);
  }, [incTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTime(0);
  }, [stopTimer]);

  const initGame = useCallback(() => {
    const { rowCount, columnCount, mineCount } = settings;

    processorRef.current = new Processor(rowCount, columnCount, mineCount);
    processorRef.current.init();
    resetTimer();
    setBoard(processorRef.current.getBoard());
    setFlagRemainingCount(mineCount);
  }, [settings, resetTimer]);

  const onCellClick = useCallback((x: number, y: number) => {
    processorRef.current.open(x, y);
    setBoard({ ...processorRef.current.getBoard() });
  }, []);

  const onCellRightClick = useCallback((x: number, y: number) => {
    processorRef.current.flag(x, y);
    setBoard({ ...processorRef.current.getBoard() });
  }, []);

  const onFaceClick = useCallback(() => {
    resetTimer();
    initGame();
  }, [initGame, resetTimer]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    setGameStatus(innerGameStatus);
  }, [innerGameStatus]);

  useEffect(() => {
    setFlagRemainingCount(innerFlagRemainingCount);
  }, [innerFlagRemainingCount]);

  useEffect(() => {
    if (gameStatus === GameStatus.InProgress) {
      startTimer();
    } else if (gameStatus === GameStatus.Win || gameStatus === GameStatus.Lose) {
      if (gameStatus === GameStatus.Win) {
        setIsVictoryModalOpened(true);
      }
      stopTimer();
    }

    return stopTimer;
  }, [gameStatus, startTimer, stopTimer]);

  useEffect(() => {
    if (!isVictoryModalOpened) {
      setVictoryImage('');
    }
  }, [isVictoryModalOpened]);

  useEffect(() => {
    if (!victoryImage) {
      let isSubscribed = true;

      const loadAndSetVictoryImage = async () => {
        const image = await getGiphyImage();

        new Image().src = image;

        if (isSubscribed) {
          setVictoryImage(image);
        }
      };

      loadAndSetVictoryImage().catch(console.error);

      return () => {
        isSubscribed = false;
      };
    }
  }, [victoryImage]);

  return (
    <>
      <Layout
        className={className}
        toolbar={
          <Toolbar
            status={gameStatus}
            time={time}
            flagCount={flagRemainingCount}
            onFaceClick={onFaceClick}
          />
        }
        board={
          <Board board={board} onCellClick={onCellClick} onCellRightClick={onCellRightClick} />
        }
      />
      <VictoryModal
        image={victoryImage}
        isOpen={isVictoryModalOpened}
        onRequestClose={toggleVictoryModal}
      />
    </>
  );
};
