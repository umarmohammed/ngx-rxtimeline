import { Complete } from '../core/types';

export interface AxisOptions {
  tickLineLength?: number;
  showGridLines?: boolean;
  showAxisLine?: boolean;
  fontFace?: string;
  fontSize?: number;
}

export interface ResourceOptions {
  gap?: number;
  padding?: number;
}

export interface ActivityOptions {
  fontFace?: string;
  fontSize?: number;
  lateralMargin?: number;
  disableDrag?: boolean;
  padding?: number;
}

export interface TypeOptions {
  activity?: ActivityOptions;
}

export interface Options {
  orientation?: 'Vertical' | 'Horizontal';
  timeAxis?: AxisOptions;
  strokeWidth?: number;
  resourceAxis?: AxisOptions;
  resource?: ResourceOptions;
  activity?: ActivityOptions;
  type?: { [key: string]: TypeOptions };
}

export type CompleteOptions = Complete<Options>;

export const defaultOptions: CompleteOptions = {
  orientation: 'Vertical',
  timeAxis: {
    tickLineLength: 5,
    showGridLines: true,
    showAxisLine: true,
    fontFace: 'sans-serif',
    fontSize: 10
  },
  strokeWidth: 3,
  resourceAxis: {
    tickLineLength: 0,
    showGridLines: true,
    showAxisLine: true,
    fontFace: 'sans-serif',
    fontSize: 16
  },
  resource: {
    gap: 0.25,
    padding: 5
  },
  activity: {
    fontFace: 'Arial',
    fontSize: 10,
    lateralMargin: 0,
    disableDrag: false,
    padding: 5
  },
  type: {}
};
