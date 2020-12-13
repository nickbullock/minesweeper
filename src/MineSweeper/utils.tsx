import React from 'react';

import { shuffle } from '../utils';

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

export const getGiphyImage = async (): Promise<string> => {
  const [q] = shuffle(['you+are+amazing', 'winner', 'win', 'victory', 'the+best', 'easy']);
  let giphyURL = `https://api.giphy.com/v1/gifs/search?q=${q}&api_key=A7SsRREfX9e8F1irZommO3WNebEhcRd2&limit=10`;

  try {
    const images = await fetch(giphyURL).then(res => res.json());
    const [image] = shuffle(images.data as any[]);

    return image.images.original.url;
  } catch (e) {
    console.error(e);
  }

  return '';
};
