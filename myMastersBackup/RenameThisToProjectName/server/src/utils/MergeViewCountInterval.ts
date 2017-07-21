import * as _ from 'lodash';
import {
  ISingleViewCount,
} from '../types';

interface IViewCountSegment {
  Segments: {startTime: number, endTime: number}[];
  ViewPointArray: ISingleViewCount[];
}

const generateSegments = (endPoints: number[]): {startTime: number, endTime: number}[] => {
  // Remove duplicate value
  const newEndPoints: number[] = Array.from(new Set(endPoints)).sort((a, b) => (a - b));
  // Remove head and tail element and add to previous result
  const newMergedEndPoints = [...newEndPoints, ..._.slice(newEndPoints, 1, -1)].sort((a, b) => (a - b));
  /*
  Partition & Prepare to group
  Example: 0 1 2 4
  After this step, it should be:
  Result: 0 1 1 2 2 4
  There will be three segments: [0, 1] [1, 2] [2, 4]
  */
  const tempResult = _.chunk(newMergedEndPoints, 2);
  const finalResult: {startTime: number, endTime: number}[] = [];
  for (const element of tempResult) {
    finalResult.push({
      startTime: element[0],
      endTime: element[1],
    });
  }
  return finalResult;
};

export const mergeViewCountInterval = (viewCount: ISingleViewCount[]) => {
  // Merge all the interval first, just like normal interval merge algorithm
  viewCount.sort((a, b) => (a.StartTimeStamp - b.StartTimeStamp));
  const groupViewCountSegment: IViewCountSegment[] = [];
  let startTimeStamp = viewCount[0].StartTimeStamp;
  let endTimeStamp = viewCount[0].EndTimeStamp;
  let endPoints: number[] = [];
  let viewPointArray = [];
  for (const viewcount of viewCount) {
    if (viewcount.StartTimeStamp <= endTimeStamp) {
      endTimeStamp = Math.max(endTimeStamp, viewcount.EndTimeStamp);
      endPoints.push(viewcount.StartTimeStamp, viewcount.EndTimeStamp);
      viewPointArray.push(viewcount);
    } else {
      groupViewCountSegment.push(
        {
          Segments: generateSegments(endPoints),
          ViewPointArray: viewPointArray,
        },
      );
      endPoints = [];
      viewPointArray = [];
      startTimeStamp = viewcount.StartTimeStamp;
      endTimeStamp = viewcount.EndTimeStamp;
    }
  }
  groupViewCountSegment.push(
    {
      Segments: generateSegments(endPoints),
      ViewPointArray: viewPointArray,
    },
  );
  // Rebuild viewCount
  const finalResult: ISingleViewCount[] = [];
  for (const viewCountSegment of groupViewCountSegment) {
    // First Rebuild
    const tempResult = [];
    for (const segment of viewCountSegment.Segments) {
      const startTime = segment.startTime;
      const endTime = segment.endTime;
      let counter = 0;
      for (const array of <ISingleViewCount[]> viewCountSegment.ViewPointArray) {
        if (startTime >= array.StartTimeStamp && startTime < array.EndTimeStamp) {
          counter += array.Counter;
        }
      }
      tempResult.push(
        <ISingleViewCount> {
          StartTimeStamp: startTime,
          EndTimeStamp: endTime,
          Counter: counter,
        },
      );
    }
    // Second Rebuild
    let startTime = tempResult[0].StartTimeStamp;
    let endTime = tempResult[0].EndTimeStamp;
    let counter = tempResult[0].Counter;
    for (const viewCount of tempResult) {
      if (viewCount.Counter !== counter) {
        finalResult.push(
          <ISingleViewCount> {
            StartTimeStamp: startTime,
            EndTimeStamp: endTime,
            Counter: counter,
          },
        );
        startTime = viewCount.StartTimeStamp;
        endTime = viewCount.EndTimeStamp;
        counter = viewCount.Counter;
      } else {
        endTime = viewCount.EndTimeStamp;
      }
    }
    finalResult.push(
      <ISingleViewCount> {
        StartTimeStamp: startTime,
        EndTimeStamp: endTime,
        Counter: counter,
      },
    );
  }
  return finalResult;
};
