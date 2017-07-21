import { IHighlightSelectSection } from '../../../src/types';
import {
  IFilmstripDimensionsData,
  IFilmstripSingleRowData,
  IFilmstripThumbnailData,
  IFilmstripSingleHeatMapData,
} from '../../../src/components/Filmstrip/types';
import { IHighlightData } from '../../../src/types/ISystemCommon';

export const defaultCursorPosition = {
  x: 500,
  y: 50,
  isOutside: false,
};

export const defaultDimensionsData: IFilmstripDimensionsData = {
  filmstripCoreHeight: 110,
  filmstripCoreWidth: 1100,
  filmstripRow: 1,
  thumbnailColumn: 10,
  thumbnailWidth: 100,
  thumbnailHeight: 100,
  generalWidth: 1000,
  generalHeight: 100,
  thumbnailLayerHeight: 100,
  heatmapLayerHeight: 25,
  highlightLayerHeight: 25,
  indicatorLayerHeight: 100,
};

export const defaultFilmstripRowData: IFilmstripSingleRowData = {
  startTime: 0,
  endTime: 100,
};

export const defaultThumbnailData: IFilmstripThumbnailData = {
  numThumbnailDisplay: 50,
  duration: 100,
  src: 'http://videx.ece.ubc.ca/thumbnail/',
  sourceTotalNumber: 1000,
};

export const defaultCurrentTime = 50;

export const defaultSelectSection: IHighlightSelectSection = {
  selectSectionStartTime: 25,
  selectSectionEndTime: 50,
  status: 'end',
};

export const defaultHighlightData: IHighlightData = {
  red: [
    { start: 0, end: 10 },
    { start: 10, end: 50 },
    { start: 60, end: 70 },
    { start: 80, end: 140 },
    { start: 150, end: 170 },
  ],
  blue: [
  ],
  purple: [
  ],
  yellow: [
  ],
  green: [
    { start: 0, end: 10 },
    { start: 10, end: 50 },
    { start: 60, end: 70 },
    { start: 80, end: 140 },
    { start: 150, end: 170 },
  ],
};

export const onHighlightFilmstripPlayHighlight = (highlightData, index) => ({
  highlightStart: highlightData.start,
  highlightEnd: highlightData.end,
  highlightIndex: index,
});

export const defaultHeatmapCrowdData: Array<IFilmstripSingleHeatMapData> = [
  { time: 1, counter: 10 },
  { time: 10, counter: 10 },
  { time: 20, counter: 10 },
  { time: 30, counter: 10 },
  { time: 40, counter: 10 },
  { time: 50, counter: 10 },
  { time: 60, counter: 10 },
  { time: 70, counter: 10 },
  { time: 80, counter: 10 },
  { time: 90, counter: 10 },
  { time: 100, counter: 10 },
  { time: 110, counter: 10 },
];

export const defaultHeatmapIndividualData: Array<IFilmstripSingleHeatMapData> = [
  { time: 1, counter: 20 },
  { time: 10, counter: 20 },
  { time: 20, counter: 20 },
  { time: 30, counter: 20 },
  { time: 40, counter: 20 },
  { time: 50, counter: 20 },
  { time: 60, counter: 20 },
  { time: 70, counter: 20 },
  { time: 80, counter: 20 },
  { time: 90, counter: 20 },
  { time: 100, counter: 20 },
  { time: 110, counter: 20 },
];
