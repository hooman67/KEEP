import React, { Component } from 'react';
import { pixelToTimestamp } from '../FilmstripHelper';
import HighlightMapCore from './Highlight/HighlightCore';
import ViewCountCore from './ViewCount/ViewCountCore';
import IndicatorCore from './Indicator/IndicatorCore';
import ThumbnailCore from './Thumbnail/ThumbnailCore';
import CommentMapCore from './Comment/CommentCore';
import uuid from 'uuid';
import {
  TFilmstripActions,
  TFilmstripInputData,
} from '../types';
import {
  ICursorPosition,
} from '../../../types';
import styles from './styles.css';

export default class FilmstripEventWrap extends Component<any, any> {
  /**
   * FilmstripEventWrap constructor function
   *
   * @param props
   */
  constructor (props) {
    super(props);
    this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
    this.onMousedownHandler = this.onMousedownHandler.bind(this);
    this.onMouseupHandler = this.onMouseupHandler.bind(this);
  }

  /**
   * onMouseMove event handler
   *
   */
  onMouseMoveHandler () {
    const inputData: TFilmstripInputData = this.props.inputData;
    const actions: TFilmstripActions = this.props.actions;
    const cursorPosition: ICursorPosition = this.props.cursorPosition;
    // if filmstrip highlight select section action starts
    // it will process the cursor coordinates

    if(inputData.activeCommentData == null && inputData.activeHighlightData != null){
      if (inputData.indicatorData.selectSectionDataHighlight.status === 'start') {
        actions.onHighlightSelectSectionInProcess(
          pixelToTimestamp(cursorPosition.x, inputData.boundaryData, inputData.dimensionsData),
        );
      }
    }else if(inputData.activeCommentData != null && inputData.activeHighlightData == null){
      if (inputData.indicatorData.selectSectionDataComment.status === 'start'){
        actions.onCommentSelectSectionInProcess(
          pixelToTimestamp(cursorPosition.x, inputData.boundaryData, inputData.dimensionsData),
        );
      }
    }

  }

  /**
   * onMouseDown event handler
   *
   */
  onMousedownHandler () {
    const inputData: TFilmstripInputData = this.props.inputData;
    const actions: TFilmstripActions = this.props.actions;
    const cursorPosition: ICursorPosition = this.props.cursorPosition;

    if(inputData.activeCommentData == null && inputData.activeHighlightData != null){
    // call onFilmstripSelectSectionStart action to start the filmstrip highlight selection
      actions.onHighlightSelectSectionStart(
        pixelToTimestamp(cursorPosition.x, inputData.boundaryData, inputData.dimensionsData),
      );
    }else if(inputData.activeCommentData != null && inputData.activeHighlightData == null){
      actions.onCommentSelectSectionStart(
        pixelToTimestamp(cursorPosition.x, inputData.boundaryData, inputData.dimensionsData),
      );
    }
  }

  /**
   * onMouseUp event handler
   *
   */
  onMouseupHandler () {
    const inputData: TFilmstripInputData = this.props.inputData;
    const actions: TFilmstripActions = this.props.actions;
    const cursorPosition: ICursorPosition = this.props.cursorPosition;

    const onClickTimeStamp: number = pixelToTimestamp(
      cursorPosition.x, inputData.boundaryData, inputData.dimensionsData,
    );

    if(inputData.activeCommentData == null && inputData.activeHighlightData != null){
    // check the time difference between start and end time
      if (Math.abs(inputData.indicatorData.selectSectionDataHighlight.selectSectionStartTime - onClickTimeStamp) < 0.5) {
        // if the difference is less then 0.5 second, then it will be seen as a click event
        actions.onHighlightSelectSectionClear();
        actions.onVideoPlayerSeek(onClickTimeStamp);
      } else {
        // Otherwise it is a drag event
        actions.onHighlightSelectSectionEnd(
          inputData.indicatorData.selectSectionDataHighlight.selectSectionStartTime, onClickTimeStamp,
        );
      }
    }else if(inputData.activeCommentData != null && inputData.activeHighlightData == null){
      if (Math.abs(inputData.indicatorData.selectSectionDataComment.selectSectionStartTime - onClickTimeStamp) < 0.5) {
        // if the difference is less then 0.5 second, then it will be seen as a click event
        actions.onCommentSelectSectionClear();
        actions.onVideoPlayerSeek(onClickTimeStamp);
      } else {
        // Otherwise it is a drag event
        // actions.onCommentSendText(uuid.v4(),
        //   inputData.indicatorData.selectSectionDataComment.selectSectionStartTime, onClickTimeStamp, "Test"
        // );
        actions.onCommentSelectSectionEndFS("",inputData.indicatorData.selectSectionDataComment.selectSectionStartTime, onClickTimeStamp);
      }
    }
  }

  /**
   * Renders the component.
   *
   * @return {ReactElement} - HTML markup for the component
   */
  render () {
    const { inputData, cursorPosition, actions } = this.props;
    // Parent div will listen events that propagated from child components
    return (
      <div
        onMouseDown={this.onMousedownHandler}
        onMouseMove = {this.onMouseMoveHandler}
        onMouseUp={this.onMouseupHandler}
      >
       
        <ThumbnailCore
          className={styles.thumbnail}
          dimensionsData={inputData.dimensionsData}
          boundaryData={inputData.boundaryData}
          thumbnailData={inputData.thumbnailData}
          cursorPosition={cursorPosition}
          commentData={inputData.commentData}
        />
        <ViewCountCore
          className={styles.viewcount}
          dimensionsData={inputData.dimensionsData}
          viewCountData={inputData.viewcountData}
          cursorPosition={cursorPosition}
        />

        <HighlightMapCore
          className={styles.highlight}
          dimensionsData={inputData.dimensionsData}
          highlightData={inputData.highlightData}
          onVideoPlayerPlayHighlightStart={actions.onVideoPlayerPlayHighlightStart}
          cursorPosition={cursorPosition}
        />

        <CommentMapCore
          className={styles.comment}
          dimensionsData={inputData.dimensionsData}
          commentData={inputData.commentData}
          onVideoPlayerPlayCommentClick={actions.onVideoPlayerPlayCommentClick}
          onCommentHover={actions.onCommentHover}
          cursorPosition={cursorPosition}
          editCommentFilmStrip = {actions.editCommentFilmStrip}
          cancelCommentEditFilmstrip = {actions.cancelCommentEditFilmstrip}
        />

        <IndicatorCore
          className={styles.indicator}
          boundaryData={inputData.boundaryData}
          dimensionsData={inputData.dimensionsData}
          indicatorData={inputData.indicatorData}
          cursorPosition={cursorPosition}
        />

      </div>
    );
  }
}
