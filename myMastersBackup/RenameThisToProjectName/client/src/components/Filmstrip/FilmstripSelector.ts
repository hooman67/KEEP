import { createSelector } from 'reselect';
import Perf from 'react-addons-perf';
import moment from 'moment';
import {
  IHighlightData,
  ICommentData
} from '../../types';
import {
  TFilmstripInputData,
  IDimensions,
  IMarkerData,
} from './types';
import {
  FILMSTRIP_HEIGHT,
  HEATMAP_PORTION, HIGHLIGHT_COLOR_COUNT,
  HIGHLIGHT_PORTION,
} from './config';
import {
  viewCountDataTransform,
  viewCountFilter,
  pixelToTimestamp,
  timestampToPixel,
} from './FilmstripHelper';

// TODO: FROM REAL DATA:
const coordinates = [
  {index: '2449.jpeg', x: 0, y: 0, width: 400, height: 300},
  {index: '1.jpeg', x: 400, y: 0, width: 400, height: 300},
  {index: '1021.jpeg', x: 800, y: 0, width: 400, height: 300},
  {index: '1057.jpeg', x: 1200, y: 0, width: 400, height: 300},
  {index: '1069.jpeg', x: 0, y: 300, width: 400, height: 300},
  {index: '109.jpeg', x: 400, y: 300, width: 400, height: 300},
  {index: '1105.jpeg', x: 800, y: 300, width: 400, height: 300},
  {index: '1117.jpeg', x: 1200, y: 300, width: 400, height: 300},
  {index: '1153.jpeg', x: 0, y: 600, width: 400, height: 300},
  {index: '1165.jpeg', x: 400, y: 600, width: 400, height: 300},
  {index: '1201.jpeg', x: 800, y: 600, width: 400, height: 300},
  {index: '1213.jpeg', x: 1200, y: 600, width: 400, height: 300},
  {index: '1249.jpeg', x: 0, y: 900, width: 400, height: 300},
  {index: '1261.jpeg', x: 400, y: 900, width: 400, height: 300},
  {index: '1297.jpeg', x: 800, y: 900, width: 400, height: 300},
  {index: '13.jpeg', x: 1200, y: 900, width: 400, height: 300},
  {index: '1309.jpeg', x: 0, y: 1200, width: 400, height: 300},
  {index: '1345.jpeg', x: 400, y: 1200, width: 400, height: 300},
  {index: '1357.jpeg', x: 800, y: 1200, width: 400, height: 300},
  {index: '1393.jpeg', x: 1200, y: 1200, width: 400, height: 300},
  {index: '1405.jpeg', x: 0, y: 1500, width: 400, height: 300},
  {index: '1441.jpeg', x: 400, y: 1500, width: 400, height: 300},
  {index: '145.jpeg', x: 800, y: 1500, width: 400, height: 300},
  {index: '1453.jpeg', x: 1200, y: 1500, width: 400, height: 300},
  {index: '1489.jpeg', x: 0, y: 1800, width: 400, height: 300},
  {index: '1501.jpeg', x: 400, y: 1800, width: 400, height: 300},
  {index: '1537.jpeg', x: 800, y: 1800, width: 400, height: 300},
  {index: '1549.jpeg', x: 1200, y: 1800, width: 400, height: 300},
  {index: '157.jpeg', x: 0, y: 2100, width: 400, height: 300},
  {index: '1585.jpeg', x: 400, y: 2100, width: 400, height: 300},
  {index: '1597.jpeg', x: 800, y: 2100, width: 400, height: 300},
  {index: '1633.jpeg', x: 1200, y: 2100, width: 400, height: 300},
  {index: '1645.jpeg', x: 0, y: 2400, width: 400, height: 300},
  {index: '1681.jpeg', x: 400, y: 2400, width: 400, height: 300},
  {index: '1693.jpeg', x: 800, y: 2400, width: 400, height: 300},
  {index: '1729.jpeg', x: 1200, y: 2400, width: 400, height: 300},
  {index: '1741.jpeg', x: 0, y: 2700, width: 400, height: 300},
  {index: '1777.jpeg', x: 400, y: 2700, width: 400, height: 300},
  {index: '1789.jpeg', x: 800, y: 2700, width: 400, height: 300},
  {index: '1825.jpeg', x: 1200, y: 2700, width: 400, height: 300},
  {index: '1837.jpeg', x: 0, y: 3000, width: 400, height: 300},
  {index: '1873.jpeg', x: 400, y: 3000, width: 400, height: 300},
  {index: '1885.jpeg', x: 800, y: 3000, width: 400, height: 300},
  {index: '1921.jpeg', x: 1200, y: 3000, width: 400, height: 300},
  {index: '193.jpeg', x: 0, y: 3300, width: 400, height: 300},
  {index: '1933.jpeg', x: 400, y: 3300, width: 400, height: 300},
  {index: '1969.jpeg', x: 800, y: 3300, width: 400, height: 300},
  {index: '1981.jpeg', x: 1200, y: 3300, width: 400, height: 300},
  {index: '2017.jpeg', x: 0, y: 3600, width: 400, height: 300},
  {index: '2029.jpeg', x: 400, y: 3600, width: 400, height: 300},
  {index: '205.jpeg', x: 800, y: 3600, width: 400, height: 300},
  {index: '2065.jpeg', x: 1200, y: 3600, width: 400, height: 300},
  {index: '2077.jpeg', x: 0, y: 3900, width: 400, height: 300},
  {index: '2113.jpeg', x: 400, y: 3900, width: 400, height: 300},
  {index: '2125.jpeg', x: 800, y: 3900, width: 400, height: 300},
  {index: '2161.jpeg', x: 1200, y: 3900, width: 400, height: 300},
  {index: '2173.jpeg', x: 0, y: 4200, width: 400, height: 300},
  {index: '2209.jpeg', x: 400, y: 4200, width: 400, height: 300},
  {index: '2221.jpeg', x: 800, y: 4200, width: 400, height: 300},
  {index: '2257.jpeg', x: 1200, y: 4200, width: 400, height: 300},
  {index: '2269.jpeg', x: 0, y: 4500, width: 400, height: 300},
  {index: '2305.jpeg', x: 400, y: 4500, width: 400, height: 300},
  {index: '2317.jpeg', x: 800, y: 4500, width: 400, height: 300},
  {index: '2353.jpeg', x: 1200, y: 4500, width: 400, height: 300},
  {index: '2365.jpeg', x: 0, y: 4800, width: 400, height: 300},
  {index: '2401.jpeg', x: 400, y: 4800, width: 400, height: 300},
  {index: '241.jpeg', x: 800, y: 4800, width: 400, height: 300},
  {index: '2413.jpeg', x: 1200, y: 4800, width: 400, height: 300},
  {index: '1009.jpeg', x: 0, y: 5100, width: 400, height: 300},
  {index: '2461.jpeg', x: 400, y: 5100, width: 400, height: 300},
  {index: '2497.jpeg', x: 800, y: 5100, width: 400, height: 300},
  {index: '2509.jpeg', x: 1200, y: 5100, width: 400, height: 300},
  {index: '253.jpeg', x: 0, y: 5400, width: 400, height: 300},
  {index: '2545.jpeg', x: 400, y: 5400, width: 400, height: 300},
  {index: '2557.jpeg', x: 800, y: 5400, width: 400, height: 300},
  {index: '2593.jpeg', x: 1200, y: 5400, width: 400, height: 300},
  {index: '2605.jpeg', x: 0, y: 5700, width: 400, height: 300},
  {index: '2641.jpeg', x: 400, y: 5700, width: 400, height: 300},
  {index: '2653.jpeg', x: 800, y: 5700, width: 400, height: 300},
  {index: '2689.jpeg', x: 1200, y: 5700, width: 400, height: 300},
  {index: '2701.jpeg', x: 0, y: 6000, width: 400, height: 300},
  {index: '2737.jpeg', x: 400, y: 6000, width: 400, height: 300},
  {index: '2749.jpeg', x: 800, y: 6000, width: 400, height: 300},
  {index: '2785.jpeg', x: 1200, y: 6000, width: 400, height: 300},
  {index: '2797.jpeg', x: 0, y: 6300, width: 400, height: 300},
  {index: '2833.jpeg', x: 400, y: 6300, width: 400, height: 300},
  {index: '2845.jpeg', x: 800, y: 6300, width: 400, height: 300},
  {index: '2881.jpeg', x: 1200, y: 6300, width: 400, height: 300},
  {index: '289.jpeg', x: 0, y: 6600, width: 400, height: 300},
  {index: '2893.jpeg', x: 400, y: 6600, width: 400, height: 300},
  {index: '2929.jpeg', x: 800, y: 6600, width: 400, height: 300},
  {index: '2941.jpeg', x: 1200, y: 6600, width: 400, height: 300},
  {index: '2977.jpeg', x: 0, y: 6900, width: 400, height: 300},
  {index: '2989.jpeg', x: 400, y: 6900, width: 400, height: 300},
  {index: '301.jpeg', x: 800, y: 6900, width: 400, height: 300},
  {index: '3025.jpeg', x: 1200, y: 6900, width: 400, height: 300},
  {index: '3037.jpeg', x: 0, y: 7200, width: 400, height: 300},
  {index: '3073.jpeg', x: 400, y: 7200, width: 400, height: 300},
  {index: '3085.jpeg', x: 800, y: 7200, width: 400, height: 300},
  {index: '3121.jpeg', x: 1200, y: 7200, width: 400, height: 300},
  {index: '3133.jpeg', x: 0, y: 7500, width: 400, height: 300},
  {index: '3169.jpeg', x: 400, y: 7500, width: 400, height: 300},
  {index: '3181.jpeg', x: 800, y: 7500, width: 400, height: 300},
  {index: '3217.jpeg', x: 1200, y: 7500, width: 400, height: 300},
  {index: '3229.jpeg', x: 0, y: 7800, width: 400, height: 300},
  {index: '3265.jpeg', x: 400, y: 7800, width: 400, height: 300},
  {index: '337.jpeg', x: 800, y: 7800, width: 400, height: 300},
  {index: '349.jpeg', x: 1200, y: 7800, width: 400, height: 300},
  {index: '385.jpeg', x: 0, y: 8100, width: 400, height: 300},
  {index: '397.jpeg', x: 400, y: 8100, width: 400, height: 300},
  {index: '433.jpeg', x: 800, y: 8100, width: 400, height: 300},
  {index: '445.jpeg', x: 1200, y: 8100, width: 400, height: 300},
  {index: '481.jpeg', x: 0, y: 8400, width: 400, height: 300},
  {index: '49.jpeg', x: 400, y: 8400, width: 400, height: 300},
  {index: '493.jpeg', x: 800, y: 8400, width: 400, height: 300},
  {index: '529.jpeg', x: 1200, y: 8400, width: 400, height: 300},
  {index: '541.jpeg', x: 0, y: 8700, width: 400, height: 300},
  {index: '577.jpeg', x: 400, y: 8700, width: 400, height: 300},
  {index: '589.jpeg', x: 800, y: 8700, width: 400, height: 300},
  {index: '61.jpeg', x: 1200, y: 8700, width: 400, height: 300},
  {index: '625.jpeg', x: 0, y: 9000, width: 400, height: 300},
  {index: '637.jpeg', x: 400, y: 9000, width: 400, height: 300},
  {index: '673.jpeg', x: 800, y: 9000, width: 400, height: 300},
  {index: '685.jpeg', x: 1200, y: 9000, width: 400, height: 300},
  {index: '721.jpeg', x: 0, y: 9300, width: 400, height: 300},
  {index: '733.jpeg', x: 400, y: 9300, width: 400, height: 300},
  {index: '769.jpeg', x: 800, y: 9300, width: 400, height: 300},
  {index: '781.jpeg', x: 1200, y: 9300, width: 400, height: 300},
  {index: '817.jpeg', x: 0, y: 9600, width: 400, height: 300},
  {index: '829.jpeg', x: 400, y: 9600, width: 400, height: 300},
  {index: '865.jpeg', x: 800, y: 9600, width: 400, height: 300},
  {index: '877.jpeg', x: 1200, y: 9600, width: 400, height: 300},
  {index: '913.jpeg', x: 0, y: 9900, width: 400, height: 300},
  {index: '925.jpeg', x: 400, y: 9900, width: 400, height: 300},
  {index: '961.jpeg', x: 800, y: 9900, width: 400, height: 300},
  {index: '97.jpeg', x: 1200, y: 9900, width: 400, height: 300},
  {index: '973.jpeg', x: 0, y: 10200, width: 400, height: 300},
]
coordinates.sort((a, b) => {
  return Number(a.index.match(/(\d+)/g)[0]) - Number((b.index.match(/(\d+)/g)[0]));
})
const thumbnail = {
  // TODO: DURATION SHOULD BE SET BY VIDEO PLAYER
  duration: 326.6,
  coordinates: coordinates,
  src: 'https://user-images.githubusercontent.com/9393110/27505877-907e0f1e-585f-11e7-8319-3abbc7a64eb1.jpeg',
};

const filmstripDimensions = state => state.activeVideo.filmstrip ? state.activeVideo.filmstrip.dimensions : null;
const highlightData = state => state.activeVideo.highlight ? state.activeVideo.highlight.highlightData : null;
const viewCountData = state => state.activeVideo.viewcount ? state.activeVideo.viewcount.viewCounts : null;
const currentTimeData = state => state.activeVideo.player ? state.activeVideo.player.currentTime : null;
const highlightSelectSectionData = state => state.activeVideo.highlight ? state.activeVideo.highlight.selectSection : null;
const commentSelectSectionData = state => state.activeVideo.comment ? state.activeVideo.comment.selectSection : null;
const commentData = state => state.activeVideo.comment ? state.activeVideo.comment.commentData : null;

// Level 1 Dimensions Selector
const filmstripDimensionsSelector = createSelector(
  filmstripDimensions,
  (dimensions: IDimensions) => {
    if (!dimensions) {
      return null;
    }
    const rowNumber: number = Math.ceil(Math.max(1, dimensions.height / FILMSTRIP_HEIGHT));
    let columnNumber: number = 1;
    let thumbnailHeight: number = 0;
    let thumbnailWidth: number = 0;
    for (let i: number = 2; i < 20; i += 1) {
      thumbnailWidth = dimensions.width / (i - 1);
      // TODO: NEED TO USE REAL VALUE
      thumbnailHeight = thumbnailWidth / (133 / 100);
      if (thumbnailHeight < (dimensions.height / rowNumber)) {
        break;
      }
      columnNumber = i;
    }

    // Convert
    const boundary = [];
    let start = 0;
    for (let i = 1; i <= rowNumber; i += 1) {
      // TODO: USE REAL VALUE
      const end = (326.6 / rowNumber) * i;
      const data = {
        startTime: start,
        endTime: end,
      };
      boundary.push(data);
      start = end;
    }

    const generalHeight = thumbnailHeight;
    return {
      boundary,
      rowNumber,
      generalHeight,
      generalWidth: thumbnailWidth * columnNumber,
      thumbnail: {
        thumbnailWidth,
        columnNumber,
        thumbnailHeight: generalHeight,
        layerHeight: generalHeight,
      },
      highlight: {
        layerHeight: generalHeight / HIGHLIGHT_PORTION,
      },
      comment: {
        layerHeight: generalHeight / HIGHLIGHT_PORTION,
      },
      viewcount: {
        layerHeight: generalHeight / HEATMAP_PORTION,
      },
      indicator: {
        layerHeight: generalHeight,
      },
    };
  },
);

// Level 2 Highlight Selector
const filmstripHighlightSelector = createSelector(
  filmstripDimensionsSelector,
  highlightData,
  (filmstripDimensions, highlightData: IHighlightData) => {
    if (!filmstripDimensions || !highlightData) {
      return null;
    }
    return filmstripDimensions.boundary.map((boundary) => {
      const highlightResult = [];
      let highlightCounter: number = 0;
      let colorCounter: number = 0;
      const baseHeight: number = 1 / (HIGHLIGHT_PORTION * HIGHLIGHT_COLOR_COUNT);

      for (const singleColor in highlightData) {
        const offset: number = baseHeight * colorCounter;
        const color: string = singleColor;
        const data: { start: number, end: number }[] = highlightData[singleColor];
        colorCounter += 1;

        for (const highlight in data) {
          let start: number = timestampToPixel(data[highlight].start, boundary, filmstripDimensions);
          let end: number = timestampToPixel(data[highlight].end, boundary, filmstripDimensions);

          if (start > filmstripDimensions.generalWidth) {
            break;
          }
          if (start < 0) {
            start = 0;
          }
          if (end > filmstripDimensions.generalWidth) {
            end = filmstripDimensions.generalWidth;
          }

          if (start >= 0 && end <= filmstripDimensions.generalWidth && end > start) {
            highlightResult.push({
              key: highlightCounter,
              x: start,
              y: offset,
              width: end - start,
              height: baseHeight,
              fill: color,
              onClickData: {
                start: data[highlight].start,
                end: data[highlight].end,
              },
            });
            highlightCounter += 1;
          }
        }
      }
      return highlightResult;
    });
  },
);

// Level 2 ViewCount Selector
const filmstripViewCountSelector = createSelector(
  filmstripDimensionsSelector,
  viewCountData,
  (filmstripDimensions, viewCountData) => {
    if (!filmstripDimensions || !viewCountData.maxValue || !viewCountData.data) {
      return null;
    }
    const transformedViewCount = viewCountDataTransform(viewCountData.data);
    return filmstripDimensions.boundary.map((boundary) => {
      return ({
        data: viewCountFilter(transformedViewCount, boundary.startTime, boundary.endTime),
        maxValue: viewCountData.maxValue,
      });
    });
  },
);

// Level 2 currentTime Selector
const currentTimeSelector = createSelector(
  filmstripDimensionsSelector,
  currentTimeData,
  (filmstripDimensions, currentTimeData) => {
    if (!filmstripDimensions || !currentTimeData) {
      return null;
    }
    return filmstripDimensions.boundary.map((boundary) => {
      if (currentTimeData > boundary.startTime && currentTimeData < boundary.endTime) {
        return timestampToPixel(currentTimeData, boundary, filmstripDimensions);
      } else {
        return null;
      }
    });
  },
);

// Level 2 highlightSelectSection Selector
const highlightSelectSectionSelector = createSelector(
  filmstripDimensionsSelector,
  highlightSelectSectionData,
  (filmstripDimensions, highlightSelectSectionData) => {
    if (!filmstripDimensions || !highlightSelectSectionData) {
      return null;
    }
    return filmstripDimensions.boundary.map((boundary) => {
      let selectSectionEndTime: number = null;
      let selectSectionStartTime: number = null;
      let timestampEndSelectSection: number = null;
      let timestampStartSelectSection: number = null;
      if (highlightSelectSectionData.status !== 'free' && highlightSelectSectionData.selectSectionEndTime) {
        // calculate the start time and end time of the highlight select section
        if (highlightSelectSectionData.selectSectionEndTime < highlightSelectSectionData.selectSectionStartTime) {
          selectSectionEndTime = highlightSelectSectionData.selectSectionStartTime;
          selectSectionStartTime = highlightSelectSectionData.selectSectionEndTime;
        } else {
          selectSectionEndTime = highlightSelectSectionData.selectSectionEndTime;
          selectSectionStartTime = highlightSelectSectionData.selectSectionStartTime;
        }

        if (selectSectionEndTime > boundary.endTime) {
          timestampEndSelectSection = boundary.endTime;
        } else {
          timestampEndSelectSection = selectSectionEndTime;
        }

        if (selectSectionStartTime < boundary.startTime) {
          timestampStartSelectSection = boundary.startTime;
        } else {
          timestampStartSelectSection = selectSectionStartTime;
        }

        // check the start time and end time is valid or not
        if (timestampStartSelectSection < timestampEndSelectSection) {
          return ({
            display: {
              x: timestampToPixel(timestampStartSelectSection, boundary, filmstripDimensions),
              width: timestampToPixel(timestampEndSelectSection, boundary, filmstripDimensions)
              - timestampToPixel(timestampStartSelectSection, boundary, filmstripDimensions),
            },
            ...highlightSelectSectionData,
          });
        }
      }
      return ({
        display: null,
        ...highlightSelectSectionData,
      });
    });
  },
);

// Level 2 time mark selector
const timeMarkSelector = createSelector(
  filmstripDimensionsSelector,
  (filmstripDimensions) => {
    if (!filmstripDimensions) {
      return null;
    }
    return filmstripDimensions.boundary.map((boundary) => {
      const finalResult: IMarkerData[] = [];
      for (let i: number = 1; i <= 2; i += 1) {
        const x = (filmstripDimensions.generalWidth / 3) * i;
        finalResult.push({
          x,
          y: filmstripDimensions.generalHeight - filmstripDimensions.highlight.layerHeight,
          key: i,
          content:
            moment('2000-01-01 00:00:00')
              .startOf('day')
              .seconds(pixelToTimestamp(x, boundary, filmstripDimensions))
              .format('HH:mm:ss'),
        });
      }
      return finalResult;
    });
  },
);

/**
 * Comment Section Selector for the filmstrip
 * 
 * @return ..commentSelectSectionData
 */
const commentSelectSectionSelector = createSelector(
  filmstripDimensionsSelector,
  commentSelectSectionData,
  (filmstripDimensions, commentSelectSectionData) => {
    if (!filmstripDimensions || !commentSelectSectionData) {
      return null;
    }
    return filmstripDimensions.boundary.map((boundary) => {
      let selectSectionEndTime: number = null;
      let selectSectionStartTime: number = null;
      let timestampEndSelectSection: number = null;
      let timestampStartSelectSection: number = null;
      if (commentSelectSectionData.status !== 'free' && commentSelectSectionData.selectSectionEndTime) {
        console.log("commentSelectSectionSelector");
        // calculate the start time and end time of the highlight select section
        if (commentSelectSectionData.selectSectionEndTime < commentSelectSectionData.selectSectionStartTime) {
          selectSectionEndTime = commentSelectSectionData.selectSectionStartTime;
          selectSectionStartTime = commentSelectSectionData.selectSectionEndTime;
        } else {
          selectSectionEndTime = commentSelectSectionData.selectSectionEndTime;
          selectSectionStartTime = commentSelectSectionData.selectSectionStartTime;
        }

        if (selectSectionEndTime > boundary.endTime) {
          timestampEndSelectSection = boundary.endTime;
        } else {
          timestampEndSelectSection = selectSectionEndTime;
        }

        if (selectSectionStartTime < boundary.startTime) {
          timestampStartSelectSection = boundary.startTime;
        } else {
          timestampStartSelectSection = selectSectionStartTime;
        }

        // check the start time and end time is valid or not
        if (timestampStartSelectSection < timestampEndSelectSection) {
          return ({
            display: {
              x: timestampToPixel(timestampStartSelectSection, boundary, filmstripDimensions),
              width: timestampToPixel(timestampEndSelectSection, boundary, filmstripDimensions)
              - timestampToPixel(timestampStartSelectSection, boundary, filmstripDimensions),
            },
            ...commentSelectSectionData,
          });
        }
      }
      return ({
        display: null,
        ...commentSelectSectionData,
      });
    });
  },
);

// Level 2 Comment Selector
const filmstripCommentSelector = createSelector(
  filmstripDimensionsSelector,
  commentData,
  (filmstripDimensions, commentData: ICommentData) => {
    if (!filmstripDimensions || !commentData) {
      return null;
    }
    return filmstripDimensions.boundary.map((boundary) => {
      const commentResult = [];
      let commentCounter: number = 0;
      let colorCounter: number = 0;
      const baseHeight: number = 1 / (HIGHLIGHT_PORTION * HIGHLIGHT_COLOR_COUNT);

      for (const singleColor in commentData) {
        const offset: number = baseHeight * colorCounter;
        const color: string = singleColor;
        const data: { start: number, end: number, Text: string }[] = commentData[singleColor];
        colorCounter += 1;

        for (const comment in data) {
          let start: number = timestampToPixel(data[comment].start, boundary, filmstripDimensions);
          let end: number = timestampToPixel(data[comment].end, boundary, filmstripDimensions);

          if (start > filmstripDimensions.generalWidth) {
            break;
          }
          if (start < 0) {
            start = 0;
          }
          if (end > filmstripDimensions.generalWidth) {
            end = filmstripDimensions.generalWidth;
          }

          if (start >= 0 && end <= filmstripDimensions.generalWidth && end > start) {
            commentResult.push({
              key: commentCounter,
              x: start,
              y: offset,
              width: end - start,
              height: baseHeight,
              fill: color,
              onClickData: {
                start: data[comment].start,
                end: data[comment].end,
                Text: data[comment].Text,
              },
            });
            commentCounter += 1;
          }
        }
      }
      return commentResult;
    });
  },
);


// Level 3 Final Result Selector
export const filmstripAggregateSelector = createSelector(
  filmstripDimensionsSelector,
  filmstripHighlightSelector,
  filmstripViewCountSelector,
  currentTimeSelector,
  highlightSelectSectionSelector,
  commentSelectSectionSelector,
  filmstripCommentSelector,
  timeMarkSelector,
  (filmstripDimensions, highlightData, viewCountData, currentTimeData, highlightSelectSectionData, commentSelectSectionData, filmstripCommentSelector, markerData) => {
    if (
      !filmstripDimensions
      || !highlightData
      || !viewCountData
      || !currentTimeData
      || !highlightSelectSectionData
      || !filmstripCommentSelector
      || !markerData
    ) {
      return null;
    }
    const finalResult: TFilmstripInputData[] = [];
    for (let i = 0; i < filmstripDimensions.rowNumber; i += 1) {
      finalResult.push({
        key: i,
        boundaryData: filmstripDimensions.boundary[i],
        dimensionsData: {
          generalHeight: filmstripDimensions.generalHeight,
          generalWidth: filmstripDimensions.generalWidth,
          thumbnail: filmstripDimensions.thumbnail,
          highlight: filmstripDimensions.highlight,
          comment: filmstripDimensions.comment,
          viewcount: filmstripDimensions.viewcount,
          indicator: filmstripDimensions.indicator,
        },
        thumbnailData: thumbnail,
        highlightData: highlightData[i],
        commentData: filmstripCommentSelector[i],
        viewcountData: viewCountData[i],
        indicatorData: {
          currentTimeData: currentTimeData[i],
          selectSectionDataHighlight: highlightSelectSectionData[i],
          selectSectionDataComment: commentSelectSectionData[i],
          markerData: markerData[i],
        },
      });
    }
    /*
    Perf.start();
    */
    return finalResult;
  },
);

