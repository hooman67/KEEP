export interface IFilmstripDimensionsData {
  generalHeight: number;
  generalWidth: number;
  thumbnail: {
    thumbnailWidth: number,
    columnNumber: number,
    thumbnailHeight: number,
    layerHeight: number,
  };
  highlight: {
    layerHeight: number,
  };
  comment: {
    layerHeight: number,
  };
  viewcount: {
    layerHeight: number,
  };
  indicator: {
    layerHeight: number,
  };
}

export interface IBoundaryData {
  startTime: number;
  endTime: number;
}

export interface IDimensions {
  height: number;
  width: number;
}
