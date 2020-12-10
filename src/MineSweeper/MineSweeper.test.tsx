import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { randomInt } from '../test-utils';

import { MineSweeper } from './MineSweeper';
import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_ROW_COUNT,
  MAX_COLUMN_COUNT,
  MAX_ROW_COUNT,
  MIN_COLUMN_COUNT,
  MIN_MINE_COUNT,
  MIN_ROW_COUNT,
} from './constants';

const getRandomSettings = () => {
  const rowCount = randomInt(MIN_ROW_COUNT, MAX_ROW_COUNT);
  const columnCount = randomInt(MIN_COLUMN_COUNT, MAX_COLUMN_COUNT);

  return {
    rowCount,
    columnCount,
    mineCount: randomInt(MIN_MINE_COUNT, rowCount * columnCount - 1),
  };
};

describe('MineSweeper', () => {
  it('renders without crashing', () => {
    const settings = getRandomSettings();
    const { container } = render(<MineSweeper settings={settings} />);

    expect(container.querySelector('.game')).toBeTruthy();
  });

  it('renders cells correctly', () => {
    const settings = getRandomSettings();
    const { container } = render(<MineSweeper settings={settings} />);

    expect(container.querySelectorAll('.cell.blank').length).toBe(
      settings.rowCount * settings.columnCount,
    );
  });

  it('starts the timer when the game starts', async () => {
    const settings = getRandomSettings();
    const { container } = render(<MineSweeper settings={settings} />);

    const timer = container.querySelector('.timer') as Element;

    expect(timer).toBeTruthy();
    expect(timer.querySelectorAll('.time0').length).toBe(3);

    const cell = container.querySelector('.cell') as Element;

    fireEvent.click(cell);

    await waitFor(() => new Promise(resolve => setTimeout(resolve, 1000)), { timeout: 2000 });

    expect(timer.querySelectorAll('.time0').length).not.toBe(3);
  });

  it('stops the timer when the game ends', async () => {
    const settings = {
      rowCount: DEFAULT_ROW_COUNT,
      columnCount: DEFAULT_COLUMN_COUNT,
      mineCount: DEFAULT_ROW_COUNT * DEFAULT_COLUMN_COUNT - 2,
    };

    const { container, debug } = render(<MineSweeper settings={settings} />);

    const timer = container.querySelector('.timer') as Element;

    expect(timer).toBeTruthy();
    expect(timer.querySelectorAll('.time0').length).toBe(3);

    const firstCell = container.querySelector('.cell') as HTMLElement;

    fireEvent.click(firstCell);

    expect(timer.querySelectorAll('.time0').length).not.toBe(3);

    const cells = container.querySelectorAll('.cell');

    fireEvent.click(cells[cells.length - 1]);

    expect(container.querySelector('.face.facedead')).toBeTruthy();

    const currentTimeClassNames = Array.from(timer.querySelectorAll('.row > div')).map(el =>
      el.classList.item(1),
    );

    await waitFor(() => new Promise(resolve => setTimeout(resolve, 1000)), { timeout: 2000 });

    currentTimeClassNames.forEach(className => {
      expect(timer.querySelector(`.${className}`)).toBeTruthy();
    });
  });

  it('decreases the number of flags when the player sets the flag', () => {
    const settings = getRandomSettings();
    const { container } = render(<MineSweeper settings={settings} />);
    const cell = container.querySelector('.cell') as Element;

    fireEvent.contextMenu(cell);

    const flagCounter = container.querySelector('.flag-counter') as HTMLElement;

    ('000' + (settings.mineCount > 999 ? 999 : settings.mineCount - 1))
      .substr(-3)
      .split('')
      .forEach(num => {
        expect(flagCounter.querySelector(`.time${num}`)).toBeTruthy();
      });
  });

  it('restarts the game when the player clicks the face', () => {
    const settings = getRandomSettings();
    const { container } = render(<MineSweeper settings={settings} />);

    const timer = container.querySelector('.timer') as Element;

    expect(container.querySelectorAll('.cell.blank').length).toBe(
      settings.rowCount * settings.columnCount,
    );

    expect(timer.querySelectorAll('.time0').length).toBe(3);

    const cell = container.querySelector('.cell') as Element;

    fireEvent.click(cell);

    expect(container.querySelectorAll('.cell.blank').length).not.toBe(
      settings.rowCount * settings.columnCount,
    );

    expect(timer.querySelectorAll('.time0').length).not.toBe(3);

    const face = container.querySelector('.face.btn') as Element;

    fireEvent.click(face);

    expect(container.querySelectorAll('.cell.blank').length).toBe(
      settings.rowCount * settings.columnCount,
    );

    expect(timer.querySelectorAll('.time0').length).toBe(3);
  });

  it('sets the "pressed" state to the cell on mousedown and default state on mouseup', () => {
    const settings = getRandomSettings();
    const { container } = render(<MineSweeper settings={settings} />);

    const cell = container.querySelector('.cell') as Element;

    fireEvent.mouseDown(cell, { button: 0 });

    expect(container.querySelectorAll('.cell.open0').length).toBe(1);

    fireEvent.mouseDown(cell, { button: 1 });

    expect(container.querySelectorAll('.cell.open0').length).toBe(1);

    fireEvent.mouseUp(cell, { button: 0 });

    expect(container.querySelectorAll('.cell.open0').length).toBe(0);
  });
});
