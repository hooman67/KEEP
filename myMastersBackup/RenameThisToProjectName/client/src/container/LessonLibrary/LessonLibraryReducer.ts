import * as actions from './ActionTypes';

const INITIAL_STATE = {
  courseLessons: [],
  courseMetadata: {},
};
/**
 * Update redux state after Ajax call
 * @constructor
 * @param state - redux state
 * @param action
 */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.LESSON_LIBRARY_FETCH:
      return {
        ...state,
        courseLessons: action.payload.courseLessons,
        courseMetadata: action.payload.courseMetadata,
      };
    case actions.LESSON_LIBRARY_SEARCH:
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
};
