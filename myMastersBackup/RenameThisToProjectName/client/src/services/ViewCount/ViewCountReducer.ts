import IReducer from './types';
import * as actions from './ActionTypes';
import {
  onViewCountUpdateCurrentTimeHelper,
} from './ViewCountHelper';

const INITIAL_STATE: IReducer = {
  viewCounts: {
    data: null,
    maxValue: null,
  },
  newViewCounts: [],
  viewCountsSection: {
    startTimeStamp: null,
    preTimeStamp: null,
    status: 'FREE',
  },
};

export default (state: IReducer = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.VIEW_COUNT_FETCH:
      const newViewCounts = [...action.ViewCounts];
      newViewCounts.sort((a, b) => (a.Counter - b.Counter));
      return {
        ...state,
        viewCounts: {
          data: action.ViewCounts,
          maxValue: newViewCounts[newViewCounts.length - 1].Counter,
        },
      };

    case actions.VIEW_COUNT_UPDATE:
      return {
        ...state,
        newViewCounts: [],
      };

    case actions.VIEW_COUNT_UPDATE_CURRENT_TIME:
      return onViewCountUpdateCurrentTimeHelper(state, action.timeStamp);

    case actions.VIEW_COUNT_SAVE_INTERVAL:
      if (Math.abs(state.viewCountsSection.startTimeStamp - state.viewCountsSection.preTimeStamp) > 1.0) {
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
            ...state.viewCountsSection,
            startTimeStamp: state.viewCountsSection.preTimeStamp,
            preTimeStamp: state.viewCountsSection.preTimeStamp,
          },
        };
      } else {
        return {
          ...state,
          viewCountsSection: {
            ...state.viewCountsSection,
            startTimeStamp: state.viewCountsSection.preTimeStamp,
            preTimeStamp: state.viewCountsSection.preTimeStamp,
          },
        };
      }

    default:
      return state;
  }
};
