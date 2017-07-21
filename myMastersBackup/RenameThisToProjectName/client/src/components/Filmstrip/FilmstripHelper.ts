import {
  IBoundaryData,
  IFilmstripDimensionsData,
} from './types';

export const viewCountFilter = (viewCountData, startTime, endtTime) => {
  const newViewCountData = [];
  let isStarted: boolean = false;
  for (const viewCount of viewCountData) {
    if (viewCount.time >= startTime && !isStarted) {
      newViewCountData.push({
        time: startTime,
        count: viewCount.count,
      });
      isStarted = true;
    }

    if (endtTime > viewCount.time && isStarted) {
      newViewCountData.push(viewCount);
    } else if (endtTime < viewCount.time && isStarted) {
      newViewCountData.push({
        time: endtTime,
        count: viewCount.count,
      });
      return newViewCountData;
    }
  }
};

export const viewCountDataTransform = (viewCountData) => {
  return viewCountData.reduce((r, viewCount) => r.push({ time: viewCount.StartTimeStamp, count: viewCount.Counter }, { time: viewCount.EndTimeStamp, count: viewCount.Counter }) && r, []);
};

export const timestampToPixel: Function =
  (input: number, boundaryData: IBoundaryData, dimensionsData: IFilmstripDimensionsData): number => (
    ((input - boundaryData.startTime) / (boundaryData.endTime - boundaryData.startTime)) * dimensionsData.generalWidth
  );

export const pixelToTimestamp: Function =
  (input: number, boundaryData: IBoundaryData, dimensionsData: IFilmstripDimensionsData): number => (
    ((input / dimensionsData.generalWidth) * (boundaryData.endTime - boundaryData.startTime)) + boundaryData.startTime
  );
