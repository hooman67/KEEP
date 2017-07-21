import {
  IFilmstripDimensionsData,
} from './IFilmstripCommon';
import {
  ICursorPosition,
} from '../../../types';

export interface ICommentCore {
  dimensionsData: IFilmstripDimensionsData;
  cursorPosition: ICursorPosition;
  commentData: ICommentData[];
  onVideoPlayerPlayCommentClick: Function;
  className: string;
  onCommentHover: Function;
}

export interface ICommentData {
  key: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  onClickData: {
    start: number,
    end: number,
    Text: string,
  };
}
