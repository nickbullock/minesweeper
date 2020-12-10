import React, { FC, MouseEvent, memo, useCallback, useState } from 'react';

import { CellView } from '../../types';
import { parseKey } from '../../../utils';

export interface CellProps {
  id: string;
  view: CellView;
  onClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
}

export const Cell: FC<CellProps> = memo((props: CellProps) => {
  const { view, id, onClick, onRightClick } = props;
  const [isCellPressed, setIsCellPressed] = useState(false);

  const onMouseUpHandler = useCallback(() => {
    setIsCellPressed(false);
    document.removeEventListener('mouseup', onMouseUpHandler);
  }, []);

  const onMouseDownHandler = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.button === 0 && view === CellView.Blank) {
        setIsCellPressed(true);
        document.addEventListener('mouseup', onMouseUpHandler);
      }
    },
    [onMouseUpHandler, view],
  );

  const onClickHandler = useCallback(() => {
    const { x, y } = parseKey(id);

    onClick(x, y);
  }, [onClick, id]);

  const onRightClickHandler = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      const { x, y } = parseKey(id);

      onRightClick(x, y);
    },
    [onRightClick, id],
  );

  return (
    <div
      className={`sprite cell ${isCellPressed ? CellView.Open : view}`}
      onMouseDown={onMouseDownHandler}
      onClick={onClickHandler}
      onContextMenu={onRightClickHandler}
    />
  );
});
