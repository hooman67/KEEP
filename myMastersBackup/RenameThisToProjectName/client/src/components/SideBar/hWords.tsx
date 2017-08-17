import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  getClosestTimestamp,
} from '../Transcript/TranscriptHelpers';

class HighlightedWords extends Component<any, any>  {

render(){

  const newTranscriptObj = [...this.props.transcriptObj];


  const highlightTextStart = this.props.hStart;
  const highlightTextEnd = this.props.hEnd;

  const startTime = getClosestTimestamp(newTranscriptObj, highlightTextStart)[0];;
  /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
  const endTime =  getClosestTimestamp(newTranscriptObj, highlightTextEnd)[1];


  const startId = newTranscriptObj.filter(obj => obj.start === startTime)[0].id;
  // /* get transcriptObj id for endTime*/
  const endId = newTranscriptObj.filter((obj) => obj.end === endTime)[0].id;

  const firstWord = newTranscriptObj[startId].text;


  const highlightedWords = newTranscriptObj.map(function(word){
    if (word.id>= startId && word.id <= endId )
    {
          return(
                <span>
                  {word.text}{' '}
                  </span>
          )};
          });

  return(
    <div> {highlightedWords}</div>
  );
  }
}

function mapStateToProps (state) {
  return {
      transcriptObj: state.activeVideo.transcript.transcriptObj
  };

}
export default connect(mapStateToProps)(HighlightedWords)
