import React, { Component } from 'react';
import _ from 'lodash';
import Thumbnail from './Thumbnail';
import { pixelToTimestamp } from '../../FilmstripHelper';
import {
  IThumbnailCore,
  IThumbnailData,
  ISingleThumbnailData,
} from '../../types';

export default class ThumbnailCore extends Component<IThumbnailCore, null> {

  /**
   * ThumbnailCore constructor function
   *
   * @param props
   */
  constructor (props: IThumbnailCore) {
    super(props);
    this.calculateIndex = this.calculateIndex.bind(this);
  }

  shouldComponentUpdate (nextProps: IThumbnailCore): boolean {
    return !_.isEqual(this.props.dimensionsData, nextProps.dimensionsData)
      || !_.isEqual(this.props.cursorPosition, nextProps.cursorPosition);
  }

  /**
   * Generate index and link for each thumbnail
   *
   * @param searchElement
   * @returns {string}
   */
  calculateIndex (searchElement: number): ISingleThumbnailData {
    const thumbnailData: IThumbnailData = this.props.thumbnailData;
    return thumbnailData.coordinates[Math.floor((searchElement / thumbnailData.duration) * thumbnailData.coordinates.length)];
  }

  /**
   * Renders the component.
   *
   * @return {ReactElement} - HTML markup for the component
   */
  render () {
    const { dimensionsData, boundaryData, cursorPosition } = this.props;

    // convert pixel to timestamp
    const cursorPositionTime: number = pixelToTimestamp(cursorPosition.x, boundaryData, dimensionsData);

    // find how many thumbnail it will generate
    const thumbnailNumber: number = dimensionsData.thumbnail.columnNumber;

    const thumbnailList: JSX.Element[] = [];
    let start: number = boundaryData.startTime;
    const offset: number = (boundaryData.endTime - boundaryData.startTime) / thumbnailNumber;

    // generate the thumbnail src link
    for (let i: number = 0; i < thumbnailNumber; i += 1) {
      let time;
      if (!cursorPosition.isOutside && cursorPositionTime >= start && cursorPositionTime < start + offset) {
        time = cursorPositionTime;
      } else {
        time = start + (offset / 2.0);
      }
      thumbnailList.push(
        <Thumbnail
          key={i}
          dimensions={{
            height: dimensionsData.thumbnail.thumbnailHeight,
            width: dimensionsData.thumbnail.thumbnailWidth,
          }}
          data={this.calculateIndex(time)}
          src={this.props.thumbnailData.src}
        />,
      );
      start += offset;
    }

    return (
      <div
        className={this.props.className}
        style={{
          height: dimensionsData.thumbnail.layerHeight,
          width: dimensionsData.generalWidth,
        }}
      >
        {thumbnailList}
      </div>
    );
  }
}
