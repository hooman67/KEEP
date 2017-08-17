import { ICursorPosition } from '../../../types/ISystemCommon';


// TODO: CHANGE ANY TYPE
export interface IThumbnailPlayer {
  key: number;
  cursorPosition: ICursorPosition;
  start: number;
  end: number;
  data: ISingleThumbnailData[];
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

export interface IThumbnailSorter{
  start: number;
  end: number;
}
