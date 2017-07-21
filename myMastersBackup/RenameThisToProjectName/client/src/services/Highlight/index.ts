import HighlightReducer from './HighlightReducer';

export {
  onHighlightToggle,
  onHighlightUpdate,
  onHighlightSelectSectionStart,
  onHighlightSelectSectionInProcess,
  onHighlightSelectSectionClear,
  onHighlightSelectSectionEnd,
  onHighlightColorSelection,
  onHighlightRemoveOff,
  onHighlightToggleMultipleHighlightRemoval,
  onHighlightSetHighlightRemove,
} from './Actions';

export {
  HIGHLIGHT_INIT,
  HIGHLIGHT_SEND_SELECTION,
  HIGHLIGHT_TOGGLE,
} from './ActionTypes';

export {
  HighlightReducer,
};
