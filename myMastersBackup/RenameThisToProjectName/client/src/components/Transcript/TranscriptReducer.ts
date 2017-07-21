import * as actions from './ActionTypes';
import {
  findSearchPhrase,
  addHighLightFlags,
} from './TranscriptHelpers';

const INITIAL_STATE = {
  transcriptObj: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.TRANSCRIPT_INIT:
      return {
        ...state,
        transcriptObj: action.Transcript,
      };

    case actions.TRANSCRIPT_SEARCH_WORD:
      const newTranscript = state.transcriptObj;
      const searchResult = findSearchPhrase(action.searchWords, state.transcriptObj);
      for (let i = 0; i < state.transcriptObj.length; i += 1) {
        newTranscript[i].isSearch = false;
      }
      for (let i = 0; i < searchResult.length; i += 1) {
        for (let j = 0; j < action.searchWords.length; j += 1) {
          newTranscript[searchResult[i] + j].isSearch = true;
        }
      }
      return {
        ...state,
        transcriptObj: newTranscript,
      };

    default:
      return state;
  }
}
