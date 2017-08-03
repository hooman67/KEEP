import * as actions from './ActionTypes';
import {
  IAction,
  ActionCreator,
} from '../ActionCreator';
import { CLIENT } from 'config';

export const onHighlightUpdate = (id, remove, create) => {
  console.log('hs onHighlightUpdate in service/hlt/Actions.ts');
  return async dispatch => {
    if (remove.length !== 0) {
      console.log(JSON.stringify({
        Highlights: remove,
      }));
      const removeRequest = await fetch(`${CLIENT.API.LESSON_API_ENDPOINT}${id}/highlights`, {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          UserUUID: '00000000-0000-0000-0001-000000000001',
        }),
        body: JSON.stringify({
          Highlights: remove,
        }),
      });
      console.log(`Remove Result: ${removeRequest.status}`);
    }
    if (create.length !== 0) {
      console.log(JSON.stringify({
        Highlights: create,
      }));
      const postRequest = await fetch(`${CLIENT.API.LESSON_API_ENDPOINT}${id}/highlights`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          UserUUID: '00000000-0000-0000-0001-000000000001',
        }),
        body: JSON.stringify({
          Highlights: create,
        }),
      });
      console.log(`Create Result: ${postRequest.status}`);
    }
    dispatch({
      type: actions.HIGHLIGHT_UPDATE,
    });
  };
};

export const onHighlightSelectSectionStart = ActionCreator<IAction>(actions.HIGHLIGHT_SELECT_SECTION_START, 'selectSectionStartTime');

export const onHighlightSelectSectionInProcess = ActionCreator<IAction>(actions.HIGHLIGHT_SELECT_SECTION_IN_PROGRESS, 'selectSectionEndTime');

export const onHighlightSelectSectionEnd = (selectSectionStartTime, selectSectionEndTime) => (dispatch) => {
  dispatch({
    type: actions.HIGHLIGHT_SEND_SELECTION,
    startTime: (selectSectionStartTime < selectSectionEndTime) ? selectSectionStartTime : selectSectionEndTime,
    endTime: (selectSectionStartTime < selectSectionEndTime) ? selectSectionEndTime : selectSectionStartTime,
  });
};

export const onHighlightToggle = ActionCreator<IAction>(actions.HIGHLIGHT_TOGGLE);

export const onHighlightSelectSectionClear = ActionCreator<IAction>(actions.HIGHLIGHT_SELECT_SECTION_CLEAR);

export const onHighlightColorSelection = ActionCreator<IAction>(actions.HIGHLIGHT_SELECT_COLOR, 'color');

export const onHighlightModeChange = ActionCreator<IAction>(actions.HIGHLIGHT_MODE_CHANGE, 'mode');

export const onHighlightRemoveOff = ActionCreator<IAction>(actions.HIGHLIGHT_REMOVE_OFF);

export const onHighlightToggleMultipleHighlightRemoval = ActionCreator<IAction>(actions.HIGHLIGHT_REMOVE_MULTIPLE);

export const onHighlightSetHighlightRemove = ActionCreator<IAction>(actions.HIGHLIGHT_REMOVE_ENABLE);
