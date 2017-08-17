/**
 * Description - Word Component
 * Parent - Line.js
 */

import React, { Component } from 'react';
import { IWordProps } from '../types';
import styles from './styles.css';
import { getCSSColor } from '../TranscriptHelpers';
import Comment from '../../Comment/Comment';

export default class Word extends Component<IWordProps, any> {
  constructor (props: any) {
    super(props);
    this.getHighlight = this.getHighlight.bind(this);
    this.onMousedownHandler = this.onMousedownHandler.bind(this);
    this.onMouseupHandler = this.onMouseupHandler.bind(this);
    this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
    this.isCurrentTimeInterval = this.isCurrentTimeInterval.bind(this);
    this.generateWord = this.generateWord.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {key: Math.random()};
  }

  onMouseMoveHandler () {
    const selectSection = this.props.selectSection;
    if (selectSection.status === 'start') {
      if(this.props.highlightingMode){
        this.props.action.onHighlightSelectSectionInProcess(this.props.word.end);
      } 
      
      this.props.action.onCommentSelectSectionInProcess(this.props.word.end);
    }
  }

  onMousedownHandler () {
    if(this.props.highlightingMode){
      this.props.action.onHighlightSelectSectionStart(this.props.word.start);
    } 

    /*hs This stores the start timestamp of the select sections in
    selectSection.selectSectionStartTime. Look at CommentReducer.ts in srvs
    */
    this.props.action.onCommentSelectSectionStart(this.props.word.start);
  }

  onMouseupHandler (forceComment) {
    const selectSection = this.props.selectSection;

    if(selectSection.selectSectionStartTime == null){
      this.props.displayButton(this.props.word.start, this.props.word.end, this.props.word.text, this.onMouseupHandler, false);
      if(this.props.commentingMode || forceComment) {
         this.props.action.onCommentSelectSectionEnd("", this.props.word.start, this.props.word.end, forceComment); 
      }
    }else{
      if (Math.abs(selectSection.selectSectionStartTime - this.props.word.end) > 0.5) {
        this.props.displayButton(selectSection.selectSectionStartTime, this.props.word.end, this.props.word.text, this.onMouseupHandler, false);
      }else{
        this.props.displayButton(this.props.word.start, this.props.word.end, this.props.word.text, this.onMouseupHandler, false);
      }

      if(this.props.highlightingMode){
        if (Math.abs(selectSection.selectSectionStartTime - this.props.word.end) > 0.5) {
          this.props.action.onHighlightSelectSectionEnd(selectSection.selectSectionStartTime, this.props.word.end, forceComment);
        } else {
          this.props.action.onHighlightSelectSectionClear();
        }
      } 
      if(this.props.commentingMode || forceComment) {
        if (Math.abs(selectSection.selectSectionStartTime - this.props.word.end) > 0.5) {
          this.props.action.onCommentSelectSectionEnd("", selectSection.selectSectionStartTime, this.props.word.end, forceComment);
        } else {
          this.props.action.onCommentSelectSectionClear();
        }
      }
    }

  }

  handleClick(){
    this.props.action.onVideoPlayerSeek(this.props.word.start);
  }

  handleMouseOut () {
    this.props.displayButtonFalse();
  }
  /** handler for adding css for highlight based on entries in word.colors */
  getHighlight () {
    switch (this.props.word.colors.length) {
      case 1:
        return `-webkit-linear-gradient(bottom, ${getCSSColor(this.props.word.colors[0])} 100%, white 0%)`;
      case 2:
        return `-webkit-linear-gradient(bottom, ${getCSSColor(this.props.word.colors[0])} 50%,
        ${getCSSColor(this.props.word.colors[1])} 100%)`;
      case 3:
        return `-webkit-linear-gradient(bottom, ${getCSSColor(this.props.word.colors[0])} 33.33%,
          ${this.props.word.colors[1]} 66.67%, ${getCSSColor(this.props.word.colors[2])} 100%)`;
      case 4:
        return `-webkit-linear-gradient(bottom, ${getCSSColor(this.props.word.colors[0])} 25%,
          ${getCSSColor(this.props.word.colors[1])} 50%, ${this.props.word.colors[2]} 75%,
          ${getCSSColor(this.props.word.colors[3])} 100%)`;
      case 5:
        return `-webkit-linear-gradient(bottom, ${getCSSColor(this.props.word.colors[0])} 20%,
        ${getCSSColor(this.props.word.colors[1])} 40%,${getCSSColor(this.props.word.colors[2])} 60%,
        ${getCSSColor(this.props.word.colors[3])} 80%, ${getCSSColor(this.props.word.colors[4])} 100%)`;
      default:
        return '';
    }
  }

  isCurrentTimeInterval () {
    return (this.props.currentTime >= this.props.word.start && this.props.currentTime < this.props.word.end)
    || (this.props.currentTime >= this.props.word.start && this.props.currentTime < this.props.word.end + 0.5)
    || (this.props.currentTime >= this.props.word.start  - 1 && this.props.currentTime < this.props.word.end);
  }

  generateWord () {
    const highlightRegular = {
      background: this.getHighlight(),
    };

    const highlightInterval = {
      background: '#ffb900',
    };

    const highlight = (this.props.showInterval) ? highlightInterval: highlightRegular;

    const action = {
      onCommentSendText: this.props.action.onCommentSendText,
      onCommentEditText: this.props.action.onCommentEditText,
      onCommentDeleteText: this.props.action.onCommentDeleteText,
      onCommentCancelText: this.props.action.onCommentCancelText,
      onCommentReply: this.props.action.onCommentReply,
      onCommentSelectSectionEnd: this.props.action.onCommentSelectSectionEnd,
      onMouseupHandler: this.onMouseupHandler,
      onMousedownHandler: this.onMousedownHandler,
      onMouseMoveHandler: this.onMouseMoveHandler,
      onCommentViewMore: this.props.action.onCommentViewMore,
      SidebarOpen: this.props.action.SidebarOpen,
      onViewMore: this.props.action.onViewMore,
      showCommentIntervalWord: this.props.action.showCommentIntervalWord,
    };

    const number = 1;

    if(this.props.comments.length > 0){
      return (
        <span>
          <span
            key = {this.state.key}
            className={this.isCurrentTimeInterval() ? styles.red : null}
            style={highlight}
            onMouseDown={this.onMousedownHandler}
            onMouseUp={()=>{this.onMouseupHandler(false)}}
            onMouseMove={this.onMouseMoveHandler}
            onClick={this.handleClick}
          >
            {this.props.word.text}{' '}
          </span>
          <Comment
            comments={this.props.comments}
            action={action}
            renderLocation={number}
          />
        </span>
      );
    } else{
      return (
        <span
          key = {this.state.key}
          className={this.isCurrentTimeInterval() ? styles.red : null}
          style={highlight}
          onMouseDown={this.onMousedownHandler}
          onMouseUp={()=>{this.onMouseupHandler(false)}}
          onMouseMove={this.onMouseMoveHandler}
          onClick={this.handleClick}
        >
          {this.props.word.text}{' '}
        </span>
      );
    }
  }

componentWillReceiveProps() {
//console.log(this.props.showInterval);
  this.forceUpdate();

}

  render () {
    //console.log('rendering');
    return (
      <span >
        {this.generateWord()}
      </span>
    );
  }
}
