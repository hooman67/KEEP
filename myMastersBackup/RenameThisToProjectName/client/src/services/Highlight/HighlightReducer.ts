import * as actions from './ActionTypes';
import {
  highlightNormalize,
  highlightGenerateDiff,
  highlightMergeIntervals,
  highlightRemoveSingleColor,
  highlightRemoveAllColor,
} from './HighlightHelper';

const INITIAL_STATE = {
  highlightData: null,
  cachedHighlightData: null,
  removeMultiColorHighlights: false,
  removeHighLight: false,
  activeHighlightColor: 'red',
  highlightingMode: false,
  // communicate with database
  highlightUpdate: {
    remove: null,
    create: null,
  },
  selectSection: {
    selectSectionStartTime: null,
    selectSectionEndTime: null,
    status: 'free',
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.HIGHLIGHT_INIT:
      return {
        ...state,
        highlightData: highlightNormalize(action.Highlights),
      };

    case actions.HIGHLIGHT_UPDATE:
      return {
        ...state,
        highlightUpdate: {
          remove: null,
          create: null,
        },
      };

    case actions.HIGHLIGHT_SELECT_COLOR:
      return {
        ...state,
        activeHighlightColor: action.color,
      };

    case actions.HIGHLIGHT_MODE_CHANGE:
      return {
        ...state,
        highlightingMode: action.mode,
      };

    // TODO: Clean Up Code
    case actions.HIGHLIGHT_SEND_SELECTION:
      const selectSectionUpdate = {
        selectSectionStartTime: action.startTime,
        selectSectionEndTime: action.endTime,
        status: 'end',
      };
      if (state.removeMultiColorHighlights) {
        const newHighlights = highlightRemoveAllColor(state.highlightData, {
          start: action.startTime,
          end: action.endTime,
        });
        const newHighlightsUUID = {};
        const highlightUpdate = {
          remove: [],
          create: [],
        };
        Object.keys(newHighlights).forEach((color) => {
          const [newUUID, newUpdate] = highlightGenerateDiff(newHighlights[color], state.highlightData[color], color);
          newHighlightsUUID[color] = newUUID;
          if (newUpdate.remove.length !== 0) {
            highlightUpdate.remove = [...highlightUpdate.remove, ...newUpdate.remove];
          }
          if (newUpdate.create.length !== 0) {
            highlightUpdate.create = [...highlightUpdate.create, ...newUpdate.create];
          }
        });
        return {
          ...state,
          highlightData: newHighlights,
          highlightUpdate,
          selectSection: selectSectionUpdate,
        };
      }
      if (state.highlightingMode) {
        if (state.removeHighLight) {
          const removedHighlights = highlightRemoveSingleColor([...state.highlightData[state.activeHighlightColor]], {
            start: action.startTime,
            end: action.endTime,
          });
          const [highlightsWithUUID, highlightUpdate] = highlightGenerateDiff(removedHighlights, state.highlightData[state.activeHighlightColor], state.activeHighlightColor);
          return {
            ...state,
            highlightData: {
              ...state.highlightData,
              [state.activeHighlightColor]: highlightsWithUUID,
            },
            highlightUpdate,
            selectSection: selectSectionUpdate,
          };
        } else if (!state.removeHighLight) {
          const mergedHighlight = highlightMergeIntervals([...state.highlightData[state.activeHighlightColor], {
            start: action.startTime,
            end: action.endTime,
          }]);
          const [highlightsWithUUID, highlightUpdate] = highlightGenerateDiff(mergedHighlight, state.highlightData[state.activeHighlightColor], state.activeHighlightColor);
          return {
            ...state,
            highlightData: {
              ...state.highlightData,
              [state.activeHighlightColor]: highlightsWithUUID,
            },
            highlightUpdate,
            selectSection: selectSectionUpdate,
          };
        }
      }
      return {
        ...state,
        selectSection: selectSectionUpdate,
      };

    case actions.HIGHLIGHT_REMOVE_OFF:
      return {
        ...state,
        removeMultiColorHighlights: false,
        removeHighLight: false,
      };

    case actions.HIGHLIGHT_REMOVE_MULTIPLE:
      return {
        ...state,
        removeMultiColorHighlights: true,
        removeHighLight: false,
      };

    case actions.HIGHLIGHT_TOGGLE:
      if (state.highlightData) {
        return {
          ...state,
          highlightData: null,
          cachedHighlightData: state.highlightData,
        };
      }
      return {
        ...state,
        highlightData: state.cachedHighlightData,
        cachedHighlightData: null,
      };

    case actions.HIGHLIGHT_REMOVE_ENABLE:
      return {
        ...state,
        removeHighLight: true,
        removeMultiColorHighlights: false,
      };

    case actions.HIGHLIGHT_SELECT_SECTION_START:
      return {
        ...state,
        selectSection: {
          ...state.selectSection,
          selectSectionStartTime: action.selectSectionStartTime,
          selectSectionEndTime: null,
          status: 'start',
        },
      };

    case actions.HIGHLIGHT_SELECT_SECTION_IN_PROGRESS:
      return {
        ...state,
        selectSection: {
          ...state.selectSection,
          selectSectionEndTime: action.selectSectionEndTime,
        },
      };

    case actions.HIGHLIGHT_SELECT_SECTION_CLEAR:
      return {
        ...state,
        selectSection: {
          ...state.selectSection,
          selectSectionStartTime: null,
          selectSectionEndTime: null,
          status: 'free',
        },
      };

    default:
      return state;
  }
};
