import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROW_COUNT,
  MAX_COLUMN_COUNT,
  MAX_ROW_COUNT,
  MIN_COLUMN_COUNT,
  MIN_MINE_COUNT,
  MIN_ROW_COUNT,
} from '../MineSweeper/constants';
import { randomInt } from '../test-utils';

import { Form } from './Form';

const getDefaultProps = (
  rowCount = DEFAULT_ROW_COUNT.toString(),
  columnCount = DEFAULT_COLUMN_COUNT.toString(),
  mineCount = DEFAULT_MINE_COUNT.toString(),
) => {
  return {
    rowCount,
    columnCount,
    mineCount,
    onRowCountChange: jest.fn(),
    onColumnCountChange: jest.fn(),
    onMineCountChange: jest.fn(),
    onSubmit: jest.fn(),
  };
};

const getInputs = () => {
  const rowsCountInput = document.querySelector('#rowCount') as HTMLInputElement;
  const columnCountInput = document.querySelector('#columnCount') as HTMLInputElement;
  const mineCountInput = document.querySelector('#mineCount') as HTMLInputElement;

  return {
    rowsCountInput,
    columnCountInput,
    mineCountInput,
  };
};

describe('Form', () => {
  it('renders rowCount, columnCount and mineCount', () => {
    const rowsCount = randomInt(MIN_ROW_COUNT, MAX_ROW_COUNT);
    const columnCount = randomInt(MIN_COLUMN_COUNT, MAX_COLUMN_COUNT);
    const mineCount = randomInt(MIN_MINE_COUNT, rowsCount * columnCount - 1);

    const props = getDefaultProps(
      rowsCount.toString(),
      columnCount.toString(),
      mineCount.toString(),
    );

    render(<Form {...props} />);
    const inputs = getInputs();

    expect(inputs.rowsCountInput.value).toBe(props.rowCount);
    expect(inputs.columnCountInput.value).toBe(props.columnCount);
    expect(inputs.mineCountInput.value).toBe(props.mineCount);
  });

  it('calls onRowCountChange, onColumnCountChange and onMineCountChange', () => {
    const rowsCount = randomInt(MIN_ROW_COUNT, MAX_ROW_COUNT);
    const columnCount = randomInt(MIN_COLUMN_COUNT, MAX_COLUMN_COUNT);
    const mineCount = randomInt(MIN_MINE_COUNT, rowsCount * columnCount - 1);

    const props = getDefaultProps();

    render(<Form {...props} />);

    const inputs = getInputs();

    const rowsCountChangeEvent = { target: { value: rowsCount.toString() } };
    const columnCountChangeEvent = { target: { value: columnCount.toString() } };
    const mineCountChangeEvent = { target: { value: mineCount.toString() } };

    fireEvent.change(inputs.rowsCountInput, rowsCountChangeEvent);
    expect(props.onRowCountChange).toHaveBeenCalled();
    fireEvent.change(inputs.columnCountInput, columnCountChangeEvent);
    expect(props.onColumnCountChange).toHaveBeenCalled();
    fireEvent.change(inputs.mineCountInput, mineCountChangeEvent);
    expect(props.onMineCountChange).toHaveBeenCalled();
  });

  it('calls onSubmit', () => {
    const props = getDefaultProps();

    const { container } = render(<Form {...props} />);

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(props.onSubmit).toHaveBeenCalled();
  });
});
