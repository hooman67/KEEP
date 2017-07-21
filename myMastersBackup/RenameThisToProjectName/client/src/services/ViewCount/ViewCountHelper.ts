import {
  IReducer,
} from './types';
import {
  mergeViewCountInterval,
} from '../../../../server/src/utils';
import { ISingleViewCount } from '../../../../server/src/types/IUserLesson';

export const onViewCountUpdateCurrentTimeHelper = (state: IReducer, timeStamp) => {
  if (state.viewCountsSection.status === 'FREE') {
    return {
      ...state,
      viewCountsSection: {
        startTimeStamp: timeStamp,
        preTimeStamp: timeStamp,
        status: 'STARTED',
      },
    };
  } else if (state.viewCountsSection.status === 'STARTED') {
    if (Math.abs(timeStamp - state.viewCountsSection.preTimeStamp) >= 2.0) {
      if (Math.abs(state.viewCountsSection.startTimeStamp - state.viewCountsSection.preTimeStamp) < 1.0) {
        return {
          ...state,
          viewCountsSection: {
            startTimeStamp: timeStamp,
            preTimeStamp: timeStamp,
            status: 'STARTED',
          },
        };
      } else {
        return {
          ...state,
          newViewCounts: [
            ...state.newViewCounts,
            {
              StartTimeStamp: state.viewCountsSection.startTimeStamp,
              EndTimeStamp: state.viewCountsSection.preTimeStamp,
              Counter: 1,
            },
          ],
          viewCountsSection: {
            startTimeStamp: timeStamp,
            preTimeStamp: timeStamp,
            status: 'STARTED',
          },
        };
      }
    } else {
      const newViewCounts =  mergeViewCountInterval(
        [
          ...state.viewCounts.data,
          ...[
            <ISingleViewCount> {
              StartTimeStamp: state.viewCountsSection.preTimeStamp,
              EndTimeStamp: timeStamp,
              Counter: 1,
            },
          ],
        ],
      );
      return {
        ...state,
        viewCountsSection: {
          ...state.viewCountsSection,
          preTimeStamp: timeStamp,
        },
        viewCounts: {
          ...state.viewCounts,
          data: newViewCounts,
          maxValue: [...newViewCounts].sort((a, b) => (a.Counter - b.Counter))[newViewCounts.length - 1].Counter,
        },
      };
    }
  }
};
