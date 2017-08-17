import CommentReducer from './CommentReducer';

export {
  onCommentToggle,
  onCommentUpdate,
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionClear,
  onCommentSelectSectionEnd,
  onCommentSendText,
  onCommentSendFilmStripText,
  onCommentEditText,
  onCommentDeleteText,
  onCommentReply,
  onCommentColorSelection,
  onCommentModeChange,
  onCommentRemoveOff,
  onCommentToggleMultipleCommentRemoval,
  onCommentSetCommentRemove,
  onCommentSelectSectionEndFS,
  onCommentExpandAll,
  onCommentViewMoreTrue,
  onCommentViewMoreFalse,
  editCommentFilmStrip,
  onCommentHover,
  onCommentNotHover,
  onCommentCancelText
} from './Actions';

export {
  COMMENT_INIT,
  COMMENT_SEND_SELECTION,
  COMMENT_TOGGLE,
} from './ActionTypes';

export {
  CommentReducer,
};
