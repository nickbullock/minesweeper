import { MineSweeperSettings } from '../../MineSweeper/types';

export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Custom = 'Custom',
}

export interface FormSubmitData {
  settings: MineSweeperSettings;
  level: Difficulty;
}
