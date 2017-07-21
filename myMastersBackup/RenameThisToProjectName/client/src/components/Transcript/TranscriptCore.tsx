/**
 * Description - Core transcript Component
 * Parent - ActiveVideo
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Measure from 'react-measure';


import {
  secondsToHms,
  transformTranscriptObj,
  findSearchPhrase,
  addHighLightFlags,
} from './TranscriptHelpers';
import Index from './components/Index';

import {
  onHighlightSelectSectionStart,
  onHighlightSelectSectionInProcess,
  onHighlightSelectSectionEnd,
  onHighlightSelectSectionClear,
} from '../../services/Highlight';
import {
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionEnd,
  onCommentSendText,
  onCommentEditText,
  onCommentDeleteText,
  onCommentReply,
  onCommentSelectSectionClear,
} from '../../services/Comment';
import {
  onVideoPlayerSeek,
} from '../VideoPlayer';
import styles from './styles.css';
import Word from './components/Word';
/*import Comment from './components/Comment';*/
import { transcriptSelector } from './TranscriptSelector';

class TranscriptCore extends Component<any, any>  {

  constructor (props: any) {
    super(props);
    this.generateTranscript = this.generateTranscript.bind(this);
  }

  generateTranscript () {
    const action = {
      onHighlightSelectSectionStart: this.props.onHighlightSelectSectionStart,
      onHighlightSelectSectionInProcess: this.props.onHighlightSelectSectionInProcess,
      onHighlightSelectSectionEnd: this.props.onHighlightSelectSectionEnd,
      onHighlightSelectSectionClear: this.props.onHighlightSelectSectionClear,
      onVideoPlayerSeek: this.props.onVideoPlayerSeek,
      onCommentSelectSectionStart: this.props.onCommentSelectSectionStart,
      onCommentSelectSectionInProcess: this.props.onCommentSelectSectionInProcess,
      onCommentSelectSectionEnd: this.props.onCommentSelectSectionEnd,
      onCommentSelectSectionClear: this.props.onCommentSelectSectionClear,
      onCommentSendText: this.props.onCommentSendText,
      onCommentEditText: this.props.onCommentEditText,
      onCommentDeleteText: this.props.onCommentDeleteText,
      onCommentReply: this.props.onCommentReply,
    };

    var tempSelectSection = this.props.highlight.activeHighlightColor
    !== null ? this.props.highlight.selectSection :
    this.props.comment.selectSection;

    const result = (this.props.transcript || []).map(word => {
        return (
          <Word
            key={word.id}
            action={action}
            currentTime={this.props.currentTime}
            selectSection={tempSelectSection}
            hsActiveHighlightColor={this.props.highlight.activeHighlightColor}
            hsActiveCommentColor={this.props.comment.activeCommentColor}
            word={word}
            comments={word.comments}
          />
        );
    });

    return (
        <div className={styles.transcriptContainer}>
          {result}
        </div>
    );
  }


  /** Handler for generating indexComponent.
  Index component is used for generating timestamps indexes. */
  renderIndex() {
    return (
      <Index
        onVideoPlayerSeek={this.props.onSeek}
        startTime={0}
        formattedTime={0}
      />
    );
  }


  /** Handler for generating lineComponent.
  Index component is used for generating timestamps ids.
  Measure is used to compute component dimension. */





  render () {
    return (
      <div>
        {this.generateTranscript()}
      </div>
    );
  }
}

const actions = {
  onVideoPlayerSeek,
  onHighlightSelectSectionStart,
  onHighlightSelectSectionInProcess,
  onHighlightSelectSectionEnd,
  onHighlightSelectSectionClear,
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionEnd,
  onCommentSelectSectionClear,
  onCommentSendText,
  onCommentEditText,
  onCommentDeleteText,
  onCommentReply,
};

function mapStateToProps (state) {
  return {
    // transcript: state.activeVideo.transcript ? state.activeVideo.transcript.transcriptObj : null,
    transcript: transcriptSelector(state),
    highlight: state.activeVideo.highlight,
    comment: state.activeVideo.comment,
  };
}

export default connect(mapStateToProps, actions)(TranscriptCore);