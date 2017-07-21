import {
  IBoundaryData,
  IFilmstripDimensionsData,
} from './IFilmstripCommon';
import {
  ICursorPosition,
} from '../../../types';

export interface IIndicatorCore {
  dimensionsData: IFilmstripDimensionsData;
  boundaryData: IBoundaryData;
  cursorPosition: ICursorPosition;
  indicatorData: any;
  className: string;
}

export interface IMouseIndicator {
  dimensionsData: IFilmstripDimensionsData;
  cursorPosition: ICursorPosition;
  boundaryData: IBoundaryData;
}

export interface ITimemarkIndicator {
  markerData: IMarkerData[];
}

export interface IMarkerData {
  x: number;
  key: number;
  content: string;
  y: number;
}

export interface ITimestampIndicator {
  dimensionsData: IFilmstripDimensionsData;
  currentTimeData: number;
}

export interface ISelectSectionIndicator {
  dimensionsData: IFilmstripDimensionsData;
  selectSectionDataHighlight: {
    display: {
      x: number,
      width: number,
    },
    selectSectionStartTime: number | null;
    selectSectionEndTime: number | null;
    status: ('free' | 'end' | 'start');
  };
  // selectSectionDataComment:{
  //   display:{
  //     x:number,
  //     width: number,
  //   },
  //   selectSectionStartTime: number | null;
  //   selectSectionEndTime: number | null;
  //   status: ('free' | 'end' | 'start');
  // };
}

export interface ISelectSectionIndicatorComment{
   dimensionsData: IFilmstripDimensionsData;
    selectSectionDataComment:{
    display:{
      x:number,
      width: number,
    },
    selectSectionStartTime: number | null;
    selectSectionEndTime: number | null;
    status: ('free' | 'end' | 'start');
  };
}
