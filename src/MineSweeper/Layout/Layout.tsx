import React, { FC, ReactElement } from 'react';

import { HorizontalBorder } from '../Borders/HorizontalBorder';
import { VerticalBorder } from '../Borders/VerticalBorder';

export interface LayoutProps {
  toolbar: ReactElement;
  board: ReactElement;
  className?: string;
}

export const Layout: FC<LayoutProps> = props => {
  const { toolbar, board, className } = props;

  return (
    <div className={`game${className ? ` ${className}` : ''}`}>
      <div className="title-bar">
        <div className="title-bar-text">Minesweeper</div>
      </div>
      <HorizontalBorder />
      <div className="row">
        <VerticalBorder long />
        <div className="row space-between flex-1 game-status-row">{toolbar}</div>
        <VerticalBorder long />
      </div>
      <HorizontalBorder type={'joint'} />
      <div className="row flex-1">
        <VerticalBorder />
        {board}
        <VerticalBorder />
      </div>
      <HorizontalBorder type={'b'} />
    </div>
  );
};
