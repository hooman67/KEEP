import {
  IFilmstripDimensionsData,
} from './IFilmstripCommon';
import {
  ICursorPosition,
} from '../../../types';
import {
  IComment,
} from '../../../services/Comment/types'

export interface ICommentCore {
  dimensionsData: IFilmstripDimensionsData;
  cursorPosition: ICursorPosition;
  commentData: ICommentData[];
  onVideoPlayerPlayCommentClick: Function;
  className: string;
  onCommentHover: Function;
}

export interface ICommentProps{
  comments: IComment[];
  className: string;
  onCommentSendText: Function;
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

