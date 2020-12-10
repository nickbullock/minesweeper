import React from 'react';

export const createRedNumbers = (num: number) => {
  const handledNum = num > 999 ? 999 : num;

  return (
    <div className="row">
      {('000' + handledNum)
        .substr(-3)
        .split('')
        .map((num, index) => (
          <div key={index} className={`sprite time${num}`} />
        ))}
    </div>
  );
};
