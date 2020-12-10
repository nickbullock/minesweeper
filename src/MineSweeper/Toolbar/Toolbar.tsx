import React, { FC, memo } from 'react';

import { GameStatus } from '../types';

import { FlagCounter } from './FlagCounter/FlagCounter';
import { OhDatFace } from './OhDatFace/OhDatFace';
import { Timer } from './Timer/Timer';

export interface ToolbarProps {
  status: GameStatus;
  flagCount: number;
  time: number;
  onFaceClick: () => void;
}

export const Toolbar: FC<ToolbarProps> = memo(props => {
  const { status, flagCount, time, onFaceClick } = props;

  return (
    <>
      <FlagCounter flagCount={flagCount} />
      <OhDatFace status={status} onClick={onFaceClick} />
      <Timer time={time} />
    </>
  );
});
