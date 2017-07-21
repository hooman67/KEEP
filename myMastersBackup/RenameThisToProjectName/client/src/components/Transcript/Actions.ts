import * as actions from './ActionTypes';
import {
  ActionCreator,
  IAction,
} from '../../services/ActionCreator';

export const onTranscriptSearch = ActionCreator<IAction>(actions.TRANSCRIPT_SEARCH_WORD, 'searchWords');
