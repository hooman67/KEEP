import { IBoundaryData, IFilmstripDimensionsData } from './IFilmstripCommon';
import { ICursorPosition } from '../../../types/ISystemCommon';

// TODO: CHANGE ANY TYPE
export interface IThumbnailCore {
  className: string;
  dimensionsData: IFilmstripDimensionsData;
  boundaryData: IBoundaryData;
  thumbnailData: any;
  cursorPosition: ICursorPosition;
}

export interface IThumbnailData {
  duration: number;
  coordinates: ISingleThumbnailData[];
  src: string;
}

export interface ISingleThumbnailData {
  index: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IThumbnail {
  key: number;
  dimensions: {
    height: number,
    width: number,
  };
  data: ISingleThumbnailData;
  src: string;
}
