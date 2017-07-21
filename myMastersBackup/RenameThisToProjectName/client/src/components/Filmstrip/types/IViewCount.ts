import {
  IFilmstripDimensionsData,
} from './IFilmstripCommon';
import {
  ICursorPosition,
} from '../../../types';

export interface IViewCountCore {
  dimensionsData: IFilmstripDimensionsData;
  viewCountData: IViewCountData;
  cursorPosition: ICursorPosition;
  className: string;
}

export interface IViewCountData {
  maxValue: number;
  data: {time: number, counter: number}[];
}
