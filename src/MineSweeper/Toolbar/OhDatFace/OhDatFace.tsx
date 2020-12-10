import React, { FC, memo } from 'react';

import { GameStatus } from '../../types';

export interface GameStatusProps {
  status: GameStatus;
  onClick: () => void;
}

const gameStateToFaceMap = {
  [GameStatus.NotStarted]: 'facesmile',
  [GameStatus.InProgress]: 'facesmile',
  [GameStatus.Lose]: 'facedead',
  [GameStatus.Win]: 'facewin',
};

export const OhDatFace: FC<GameStatusProps> = memo(props => {
  const { status, onClick } = props;
  const face = gameStateToFaceMap[status];

  return <div className={`sprite btn face ${face}`} onClick={onClick} />;
});
