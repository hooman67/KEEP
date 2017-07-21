import 'whatwg-fetch';
import { CLIENT } from 'config';
import * as actions from './ActionTypes';

export const onCourseLibraryFetch = () => {
  return async dispatch => {
    const result = await fetch(`${CLIENT.API.COURSES_API_ENDPOINT}`, {
      method: 'GET',
      headers: new Headers ({
        UserUUID: '00000000-0000-0000-0001-000000000001',
      }),
    });
    dispatch({
      type: actions.COURSE_LIBRARY_FETCH,
      payload: await result.json(),
    });
  };
};

export function onCourseLibrarySearch (searchTerm) {
  return {
    type: actions.COURSE_LIBRARY_SEARCH,
    payload: searchTerm,
  };
}
