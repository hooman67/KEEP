import {
  IFilmstripDimensionsData,
} from './IFilmstripCommon';
import {
  ICursorPosition,
} from '../../../types';

export interface IHighlightCore {
  dimensionsData: IFilmstripDimensionsData;
  cursorPosition: ICursorPosition;
  highlightData: IHighlightData[];
  onVideoPlayerPlayHighlightStart: Function;
  className: string;
}

export interface IHighlightData {
  key: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  onClickData: {
    start: number,
    end: number,
  };
}
