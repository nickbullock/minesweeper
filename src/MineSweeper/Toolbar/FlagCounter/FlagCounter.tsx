import { FC, memo } from 'react';

import { createRedNumbers } from '../../utils';

export interface FlagCounterProps {
  flagCount: number;
}

export const FlagCounter: FC<FlagCounterProps> = memo(props => {
  const { flagCount } = props;

  return <div className="flag-counter">{createRedNumbers(flagCount)}</div>;
});
