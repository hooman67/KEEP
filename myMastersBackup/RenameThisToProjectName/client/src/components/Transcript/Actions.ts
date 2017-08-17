import * as actions from './ActionTypes';
import {
  ActionCreator,
  IAction,
} from '../../services/ActionCreator';

export const onTranscriptSearch = ActionCreator<IAction>(actions.TRANSCRIPT_SEARCH_WORD, 'searchWords');

export const showCommentIntervalWord = ActionCreator<IAction>(actions.SHOW_COMMENT_INTERVAL_WORD, 'start', 'end');

export const hideCommentIntervalWord = ActionCreator<IAction>(actions.HIDE_COMMENT_INTERVAL_WORD);

export const transcriptUpdate = ActionCreator<IAction>(actions.TRANSCRIPT_UPDATE);

export const transcriptWidth = ActionCreator<IAction>(actions.TRANSCRIPT_WIDTH, 'width');
