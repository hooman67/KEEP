import * as actions from './ActionTypes';
import {
  IAction,
  ActionCreator,
} from '../ActionCreator';
import { CLIENT } from 'config';

export const onCommentUpdate = (id, remove, create, edit) => {
  console.log('hs onCommentUpdate in service/comnt/Actions.ts');
  return async dispatch => {
    if (remove.length !== 0) {
      console.log(JSON.stringify({
        Comments: remove,
      }));
      const removeRequest = await fetch(`${CLIENT.API.LESSON_API_ENDPOINT}${id}/comments`, {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          UserUUID: '00000000-0000-0000-0001-000000000001',
        }),
        body: JSON.stringify({
          Comments: remove,
        }),
      });
      console.log(`Remove Result: ${removeRequest.status}`);
    }
    if (create.length !== 0) {
      console.log(JSON.stringify({
        Comments: create,
      }));
      const postRequest = await fetch(`${CLIENT.API.LESSON_API_ENDPOINT}${id}/comments`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          UserUUID: '00000000-0000-0000-0001-000000000001',
        }),
        body: JSON.stringify({
          Comments: create,
        }),
      });
      console.log(`Create Result: ${postRequest.status}`);
    }
    if (edit.length !== 0) {
      console.log(JSON.stringify({
        Comments: create,
      }));
      const postRequest = await fetch(`${CLIENT.API.LESSON_API_ENDPOINT}${id}/comments/edit`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          UserUUID: '00000000-0000-0000-0001-000000000001',
        }),
        body: JSON.stringify({
          Comments: edit,
        }),
      });
      console.log(`Create Result: ${postRequest.status}`);
    }
    dispatch({
      type: actions.COMMENT_UPDATE,
    });
  };
};

export const onCommentSelectSectionStart = ActionCreator<IAction>(actions.COMMENT_SELECT_SECTION_START, 'selectSectionStartTime');

export const onCommentSelectSectionInProcess = ActionCreator<IAction>(actions.COMMENT_SELECT_SECTION_IN_PROGRESS, 'selectSectionEndTime');

export const onCommentSelectSectionEndFS = (parentUuid, selectSectionStartTime, selectSectionEndTime, xMouseLoc, yMouseLoc) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_SELECT_SECTION_END_FS,
    startTime: (selectSectionStartTime < selectSectionEndTime) ? selectSectionStartTime : selectSectionEndTime,
    endTime: (selectSectionStartTime < selectSectionEndTime) ? selectSectionEndTime : selectSectionStartTime,
    Text: '',
    Parent: parentUuid,
    XMouseLoc: xMouseLoc,
    YMouseLoc: yMouseLoc,
  });
};

export const onCommentSelectSectionEnd = (parentUuid, selectSectionStartTime, selectSectionEndTime, forceComment) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_SEND_SELECTION,
    startTime: (selectSectionStartTime < selectSectionEndTime) ? selectSectionStartTime : selectSectionEndTime,
    endTime: (selectSectionStartTime < selectSectionEndTime) ? selectSectionEndTime : selectSectionStartTime,
    Text: '',
    Parent: parentUuid,
    ForceComment: forceComment,
  });
};

export const onCommentSendText = (commentUuid, commentStartTime, commentEndTime, commentText, commentPreviousText, parentUuid, timeStamp) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_SEND_TEXT,
    uuid: commentUuid,
    startTime: (commentStartTime < commentEndTime) ? commentStartTime : commentEndTime,
    endTime: (commentStartTime < commentEndTime) ? commentEndTime : commentStartTime,
    TimeStamp: timeStamp,
    PreviousText: commentPreviousText,
    Text: commentText,
    Parent: parentUuid,
  });
};

export const onCommentSendFilmStripText = (commentUuid, commentStartTime, commentEndTime, commentText, commentPreviousText, parentUuid, timeStamp) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_SEND_FIlM_STRIP_TEXT,
    uuid: commentUuid,
    startTime: (commentStartTime < commentEndTime) ? commentStartTime : commentEndTime,
    endTime: (commentStartTime < commentEndTime) ? commentEndTime : commentStartTime,
    TimeStamp: timeStamp,
    PreviousText: commentPreviousText,
    Text: commentText,
    Parent: parentUuid,
  });
};

export const onCommentEditText = (commentUuid, commentStartTime, commentEndTime, commentText, parent) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_EDIT_TEXT,
    uuid: commentUuid,
    startTime: (commentStartTime < commentEndTime) ? commentStartTime : commentEndTime,
    endTime: (commentStartTime < commentEndTime) ? commentEndTime : commentStartTime,
    Text: commentText,
    Parent: parent,
  });
};

export const onCommentDeleteText = (commentUuid, commentStartTime, commentEndTime, commentText, parent) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_DELETE_TEXT,
    uuid: commentUuid,
    startTime: (commentStartTime < commentEndTime) ? commentStartTime : commentEndTime,
    endTime: (commentStartTime < commentEndTime) ? commentEndTime : commentStartTime,
    Text: commentText,
    Parent: parent,
  });
};

export const onCommentCancelText = (commentUuid, commentStartTime, commentEndTime, commentText, parent) => (dispatch) => {
  if(commentText == ""){
    dispatch({
      type: actions.COMMENT_CANCEL_TEXT,
      uuid: commentUuid,
      startTime: (commentStartTime < commentEndTime) ? commentStartTime : commentEndTime,
      endTime: (commentStartTime < commentEndTime) ? commentEndTime : commentStartTime,
      Parent: parent,
    });
  }else{
    dispatch({
      type: actions.COMMENT_CANCEL_TEXT,
      uuid: commentUuid,
      startTime: (commentStartTime < commentEndTime) ? commentStartTime : commentEndTime,
      endTime: (commentStartTime < commentEndTime) ? commentEndTime : commentStartTime,
      Text: commentText,
      Parent: parent,
    });
  }
};

export const onCommentReply = (commentUuid, commentStartTime, commentEndTime, commentText) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_REPLY,
    uuid: commentUuid,
    startTime: (commentStartTime < commentEndTime) ? commentStartTime : commentEndTime,
    endTime: (commentStartTime < commentEndTime) ? commentEndTime : commentStartTime,
    Text: commentText,
    Parent: commentUuid,
  });
};


export const onCommentToggle = ActionCreator<IAction>(actions.COMMENT_TOGGLE);

export const onCommentSelectSectionClear = ActionCreator<IAction>(actions.COMMENT_SELECT_SECTION_CLEAR);

export const onCommentColorSelection = ActionCreator<IAction>(actions.COMMENT_SELECT_COLOR, 'color');

export const onCommentModeChange = ActionCreator<IAction>(actions.COMMENT_MODE_CHANGE, 'mode');

export const onCommentRemoveOff = ActionCreator<IAction>(actions.COMMENT_REMOVE_OFF);

export const onCommentToggleMultipleCommentRemoval = ActionCreator<IAction>(actions.COMMENT_REMOVE_MULTIPLE);

export const onCommentSetCommentRemove = ActionCreator<IAction>(actions.COMMENT_REMOVE_ENABLE);

export const onCommentHover = ActionCreator<IAction>(actions.COMMENT_HOVER, 'uuid', 'showTimeRange', 'color');

export const onCommentNotHover = ActionCreator<IAction>(actions.COMMENT_NOT_HOVER, 'uuid', 'showTimeRange', 'color');

export const onCommentViewMoreTrue = ActionCreator<IAction>(actions.COMMENT_VIEW_MORE, 'commentID');
export const onCommentViewMoreFalse = ActionCreator<IAction>(actions.COMMENT_VIEW_MORE_FALSE);

export const onCommentExpandAll = ActionCreator<IAction>(actions.COMMENT_EXPAND_ALL);

export const editCommentFilmStrip = (commentUuid, commentStartTime, commentEndTime, commentText, parentUuid, timeStamp, color) => (dispatch) => {
  dispatch({
    type: actions.COMMENT_FILMSTRIP_EDIT_TOGGLE,
    uuid: commentUuid,
    startTime: commentStartTime,
    endTime: commentEndTime,
    TimeStamp: timeStamp,
    Text: commentText,
    Parent: parentUuid,
    Color: color,
  });
};