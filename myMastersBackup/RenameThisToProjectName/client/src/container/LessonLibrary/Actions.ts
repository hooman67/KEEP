import 'whatwg-fetch';
import { CLIENT } from 'config';
import * as actions from './ActionTypes';

export const onLessonLibraryFetch = (id) => {
  return async dispatch => {
    const result = await fetch(`${CLIENT.API.COURSE_API_ENDPOINT}${id}`, {
      method: 'GET',
      // TODO: CHANGE AUTHENTICATION METHOD
      headers: new Headers({
        UserUUID: '00000000-0000-0000-0001-000000000001',
      }),
    });
    dispatch({
      type: actions.LESSON_LIBRARY_FETCH,
      payload: await result.json(),
    });
  };
};

export function onLessonLibrarySearch (searchTerm) {
  return {
    type: actions.LESSON_LIBRARY_SEARCH,
    payload: searchTerm,
  };
}
