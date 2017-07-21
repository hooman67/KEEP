import { combineReducers } from 'redux';
import * as actions from './ActionTypes';
import {
  ViewCountReducer,
} from '../../services/ViewCount';
import {
  HIGHLIGHT_INIT,
  HIGHLIGHT_TOGGLE,
  HIGHLIGHT_SEND_SELECTION,
  HighlightReducer,
} from '../../services/Highlight';
import {
  COMMENT_INIT,
  COMMENT_TOGGLE,
  COMMENT_SEND_SELECTION,
  CommentReducer,
} from '../../services/Comment';
import {
  FilmstripReducer,
} from '../../components/Filmstrip';
import {
  TRANSCRIPT_INIT,
  TranscriptReducer,
} from '../../components/Transcript';
import {
  VideoPlayerReducer,
} from '../../components/VideoPlayer';

const INITIAL_STATE = {
  _id: null,
  Owner: null,
  Name: null,
};

const ContainerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.ACTIVE_VIDEO_INIT:
      return {
        ...state,
        _id: action.id,
        Owner: action.Owner,
        Name: action.Name,
      };

    default:
      return state;
  }
};

export const combinedReducer = combineReducers({
  container: ContainerReducer,
  transcript: TranscriptReducer,
  highlight: HighlightReducer,
  comment: CommentReducer,
  player: VideoPlayerReducer,
  filmstrip: FilmstripReducer,
  viewcount: ViewCountReducer,
});

const crossSliceReducer = (state, action) => {
  switch (action.type) {
    case actions.ACTIVE_VIDEO_INIT:
      const highlight = HighlightReducer(state.highlights, {
        type: HIGHLIGHT_INIT,
        Highlights: action.Highlights,
      });
      const comment = CommentReducer(state.comments, {
        type: COMMENT_INIT,
        Comments: action.Comments,
      });
      const transcript = TranscriptReducer(state.transcript, {
        type: TRANSCRIPT_INIT,
        Highlights: highlight.highlightData,
        Comments: comment.commentData,
        Transcript: action.Transcript,
      });
      return {
        ...state,
        highlight,
        comment,
        transcript,
      };

    default:
      return state;
  }
};

export default (state, action) => {
  const intermediateState = combinedReducer(state, action);
  return crossSliceReducer(intermediateState, action);
};
