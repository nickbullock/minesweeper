import React, { FC } from 'react';

export interface HorizontalBorderProps {
  type?: 't' | 'b' | 'joint';
}

export const HorizontalBorder: FC<HorizontalBorderProps> = ({ type = 't' }) => {
  return (
    <div className="row">
      <div className={`sprite border${type}l`} />
      <div className={`sprite flex-1 bordertb`} />
      <div className={`sprite border${type}r`} />
    </div>
  );
};
