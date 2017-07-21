import * as actions from './ActionTypes';

const INITIAL_STATE = [];
/**
 * Update redux state after Ajax call
 * @constructor
 * @param state - redux state
 * @param action
 */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.COURSE_LIBRARY_FETCH:
      return {
        ...state,
        courseLibraryList: [...action.payload],
      };
    case actions.COURSE_LIBRARY_SEARCH:
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
};

