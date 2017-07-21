import {
  IAction,
  ActionCreator,
} from '../ActionCreator';
import * as actions from './ActionTypes';
import { CLIENT } from 'config';

let viewCountTimer = null;

export const onViewCountFetch = (id) => {
  return async (dispatch) => {
    const viewCount = await fetch(`${CLIENT.API.LESSON_API_ENDPOINT}${id}/viewcounts`, {
      method: 'GET',
      headers: new Headers({
        UserUUID: '00000000-0000-0000-0001-000000000001',
      }),
    });
    dispatch ({
      type: actions.VIEW_COUNT_FETCH,
      ViewCounts: await viewCount.json(),
    });
  };
};

export const onViewCountUpdate = (id, data) => {
  return async (dispatch) => {
    await fetch(`${CLIENT.API.LESSON_API_ENDPOINT}${id}/viewcounts`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        UserUUID: '00000000-0000-0000-0001-000000000001',
      }),
      body: JSON.stringify({
        ViewCounts: data,
      }),
    });
    dispatch ({
      type: actions.VIEW_COUNT_UPDATE,
    });
  };
};

export const onViewCountUpdateCurrentTime = ActionCreator<IAction>(actions.VIEW_COUNT_UPDATE_CURRENT_TIME, 'timeStamp');

export const onViewCountServiceRegister = () => (dispatch) => {
  clearInterval(viewCountTimer);
  viewCountTimer = setInterval(() => dispatch(onViewCountTimerTimeOut()), CLIENT.SERVICE.VIEW_COUNT.TIMEOUT_INTERVAL);
  dispatch({
    type: actions.VIEW_COUNT_SERVICE_REGISTER,
  });
};

export const onViewCountServiceUnRegister = () => {
  clearInterval(viewCountTimer);
  return {
    type: actions.VIEW_COUNT_SERVICE_UNREGISTER,
  };
};

/* Private */
const onViewCountTimerTimeOut = () => ({
  type: actions.VIEW_COUNT_SAVE_INTERVAL,
});
