/**
 * Description - Core transcript Component
 * Parent - ActiveVideo
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import ReactCursorPosition from 'react-cursor-position';
import ColorPickerO from '../../components/ColorPickerO';

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
  onCommentCancelText,
  onCommentReply,
  onCommentSelectSectionClear,
  onCommentViewMoreTrue,
} from '../../services/Comment';
import {
  onVideoPlayerSeek,
} from '../VideoPlayer';
import styles from './styles.css';
import Word from './components/Word';
/*import Comment from './components/Comment';*/
import { transcriptSelector } from './TranscriptSelector';
import {SidebarOpen} from '../../layouts/CommandBars/ActiveVideo/sidebarAction';


class Transcript extends Component<any, any>  {

  constructor (props: any) {
    super(props);
    this.generateTranscript = this.generateTranscript.bind(this);
    this.state = {
                    displayButton: false,
                    start: null,
                    end: null,
                    commentAdder: null,
                  };
    this.handleDisplayButton = this.handleDisplayButton.bind(this);
    this.handleDisplayButtonFalse = this.handleDisplayButtonFalse.bind(this);
  }

  handleDisplayButton(istart, iend, itext, commentadder){

    this.setState({
      displayButton: true,
      start: istart,
      end: iend,
      text: itext,
      commentAdder: commentadder,
    });
    console.log('Entered on mouse click on word');
    console.log(this.state);

  }

  handleDisplayButtonFalse(){
    this.setState({displayButton: false});
    console.log('Entered on mouse out');

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
      onCommentCancelText: this.props.onCommentCancelText,
      onCommentReply: this.props.onCommentReply,
      onCommentViewMore: this.props.onCommentViewMoreTrue,
      SidebarOpen: this.props.SidebarOpen,
      onViewMore: this.props.onViewMore,
      showCommentIntervalWord: this.props.showCommentIntervalWord,
    };

    var tempSelectSection = this.props.highlight.highlightingMode ?
      this.props.highlight.selectSection :
      this.props.comment.selectSection;

    const result = (this.props.transcript || []).map(word => {
        return (
          <Word
            key={word.id}
            action={action}
            currentTime={this.props.currentTime}
            selectSection={tempSelectSection}
            highlightingMode={this.props.highlight.highlightingMode}
            commentingMode={this.props.comment.commentingMode}
            word={word}
            comments={word.comments}
            displayButton = {this.handleDisplayButton.bind(this)}
            displayButtonFalse = {this.handleDisplayButton.bind(this)}
            showInterval = {word.showInterval}
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
  //





  render () {
    return (
      <ReactCursorPosition className={styles.transcriptContainer}>
        {
          (this.state.displayButton)?
           (
            <ColorPickerO
              clickStart = {this.state.start}
              clickEnd = {this.state.end}
              clickText = {this.state.text}
              clickCommentAdder = {this.state.commentAdder}
            />
          )
          :
          (<span></span>)
        }
        <div>
          {this.generateTranscript()}
        </div>

      </ReactCursorPosition>
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
  onCommentCancelText,
  onCommentReply,
  onCommentViewMoreTrue,
  SidebarOpen,
};

function mapStateToProps (state) {
  return {
    // transcript: state.activeVideo.transcript ? state.activeVideo.transcript.transcriptObj : null,
    transcript: transcriptSelector(state),
    highlight: state.activeVideo.highlight,
    comment: state.activeVideo.comment,
  };
}

export default connect(mapStateToProps, actions)(Transcript);
