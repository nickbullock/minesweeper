import React from 'react';
import { FC, memo } from 'react';

import { createRedNumbers } from '../../utils';

export interface TimerProps {
  time: number;
}

export const Timer: FC<TimerProps> = memo(props => {
  const { time } = props;

  return <div className="timer">{createRedNumbers(time)}</div>;
});
