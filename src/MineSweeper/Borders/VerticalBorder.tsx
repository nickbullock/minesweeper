import React, { FC } from 'react';

export interface VerticalBorderProps {
  long?: boolean;
}

export const VerticalBorder: FC<VerticalBorderProps> = ({ long = false }) => {
  return (
    <div className="column">
      <div className={`sprite borderlr${long ? 'long' : ''}`} />
    </div>
  );
};
