import * as actions from './ActionTypes';
import {
  findSearchPhrase,
  addHighLightFlags,
  getClosestTimestamp,
} from './TranscriptHelpers';

const INITIAL_STATE = {
  transcriptObj: null,
  transcriptUpdate: false,
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

      case actions.SHOW_COMMENT_INTERVAL_WORD:
        const newTranscriptObj = state.transcriptObj;
        let i;

        const startTime = getClosestTimestamp(newTranscriptObj, action.start)[0];;
        /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
        const endTime =  getClosestTimestamp(newTranscriptObj, action.end)[1];
;
        /* get transcriptObj id for startTime*/
        const startId = newTranscriptObj.filter(obj => obj.start === startTime)[0].id;
        /* get transcriptObj id for endTime*/
        const endId = newTranscriptObj.filter(obj => obj.end === endTime)[0].id;

        console.log('Entered show comment interval word');

        for (i = startId; i <= endId; i += 1) {
          /* if activeColor is not present in the word.colors array then we add a color */
          newTranscriptObj[i].showInterval = true;

          }


                  return{
                    ...state,
                    transcriptObj: newTranscriptObj
                  } ;

          case actions.HIDE_COMMENT_INTERVAL_WORD:

          if (state.transcriptObj){
            const newTranscriptObj2 = state.transcriptObj;
            if (newTranscriptObj2){


            let j;


            for (j = 0; j <= newTranscriptObj2.length; j += 1) {
              if (newTranscriptObj2[j]){
              /* if activeColor is not present in the word.colors array then we add a color */
              newTranscriptObj2[j].showInterval = false;
            }

              }


                      return{
                        ...state,
                        transcriptObj: newTranscriptObj2
                      } }};

          case actions.TRANSCRIPT_UPDATE:

            return {
              ...state,
              transcriptUpdate: !state.transcriptUpdate,
            };


    default:
      return state;
  }
}
