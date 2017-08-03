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
  editCommentFilmStrip: Function;
  cancelCommentEditFilmstrip: Function;
  onCommentViewMoreTrue: any;
}

export interface ICommentProps{
  comments: IComment[];
  className: string;
  onCommentSendFilmStripText: Function;
}

export interface ICommentData {
  key: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  showTimeRange: boolean,
  onClickData: {
    _id: string,
    start: number,
    end: number,
    Text: string,
    Parent: string,
    TimeStamp: string,
  };
}
