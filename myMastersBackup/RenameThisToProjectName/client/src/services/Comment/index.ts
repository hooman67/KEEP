import CommentReducer from './CommentReducer';

export {
  onCommentToggle,
  onCommentUpdate,
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionClear,
  onCommentSelectSectionEnd,
  onCommentSendText,
  onCommentEditText,
  onCommentDeleteText,
  onCommentReply,
  onCommentColorSelection,
  onCommentRemoveOff,
  onCommentToggleMultipleCommentRemoval,
  onCommentSetCommentRemove,
  
} from './Actions';

export {
  COMMENT_INIT,
  COMMENT_SEND_SELECTION,
  COMMENT_TOGGLE,
} from './ActionTypes';

export {
  CommentReducer,
};
