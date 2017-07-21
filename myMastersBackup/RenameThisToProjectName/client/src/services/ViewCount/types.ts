import {
  ISingleViewCount,
} from '../../../../server/src/types';

export interface IReducer {
  viewCounts: {
    data: ISingleViewCount[],
    maxValue: number,
  };
  newViewCounts: ISingleViewCount[];
  viewCountsSection: {
    startTimeStamp: number,
    preTimeStamp: number,
    status: 'FREE',
  };
}

export default IReducer;
