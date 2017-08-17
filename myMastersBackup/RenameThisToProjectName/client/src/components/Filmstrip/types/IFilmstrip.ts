import {
  IBoundaryData,
  IFilmstripDimensionsData,
} from './IFilmstripCommon';
import {
  IHighlightData,
} from './IHighlight';
import {
  IViewCountData,
} from './IViewCount';
import {
  ICursorPosition,
} from '../../../types';
import{
  ICommentData
} from './IComment';

export type TFilmstripInputData = {
  key: number,
  boundaryData: IBoundaryData,
  dimensionsData: IFilmstripDimensionsData,
  thumbnailData: any,
  highlightData: IHighlightData[],
  commentData: ICommentData[],
  activeCommentData: any;
  activeHighlightData: any;
  viewcountData: IViewCountData,
  indicatorData: {
    currentTimeData: number,
    selectSectionDataHighlight: any,
    selectSectionDataComment: any,
    markerData: any,
  },
};

export type TFilmstripActions = {
  onVideoPlayerPlayHighlightStart: Function;
  onVideoPlayerSeek: Function;
  onHighlightSelectSectionClear: Function;
  onHighlightSelectSectionStart: Function;
  onHighlightSelectSectionInProcess: Function;
  onHighlightSelectSectionEnd: Function;
  onCommentSelectSectionStart: Function;
  onCommentSelectSectionInProcess: Function;
  onCommentSelectSectionClear: Function;
  onCommentSelectSectionEnd: Function;
  onVideoPlayerPlayCommentClick: Function;
  onCommentHover: Function;
  onCommentSendFilmStripText: Function;
  onCommentSelectSectionEndFS: Function;
  editCommentFilmStrip: Function;
  onCommentDeleteText: Function;
  onCommentCancelText: Function;
};

export interface IFilmstrip {
  inputData: TFilmstripInputData;
  actions: TFilmstripActions;
}

export interface IFilmstripEventWrapper {
  inputData: TFilmstripInputData;
  actions: TFilmstripActions;
  cursorPosition: ICursorPosition;
}
