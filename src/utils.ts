export const getKey = (x: number, y: number) => {
  return `${x}-${y}`;
};

export const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const parseKey = (key: string) => {
  const [x, y] = key.split('-').map(key => Number(key));

  return { x, y };
};

export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};
