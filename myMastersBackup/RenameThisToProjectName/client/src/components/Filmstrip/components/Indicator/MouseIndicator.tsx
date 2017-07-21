/**
 * MouseIndicator component display the cursor location
 *
 * @author Junyuan Zheng <joseph.zjy@gmail.com>
 */

import React, { PureComponent } from 'react';
import moment from 'moment';
import { pixelToTimestamp } from '../../FilmstripHelper';
import {
  IMouseIndicator,
} from '../../types';

export default class MouseIndicator extends PureComponent<IMouseIndicator, null> {

  render () {
    const xMax: number = this.props.dimensionsData.generalWidth - 50;

    // if cursor is outside, return null
    if (!this.props.cursorPosition.isOutside) {
      // generate cursor indicator
      const mouseIndicator = (
        <rect
          x={this.props.cursorPosition.x - 1.5}
          y={0}
          width={3}
          height={this.props.dimensionsData.indicator.layerHeight}
          fill='red'
          opacity={0.6}
        />
      );

      // generate text box
      let textXPosition = this.props.cursorPosition.x;
      if (this.props.cursorPosition.x > xMax) {
        textXPosition = xMax;
      }
      const timeText = (
        <text
          x={textXPosition + 5}
          y={this.props.dimensionsData.highlight.layerHeight}
          fill='white'
          fontSize='x-small'
          filter='url(#background)'
        >
          {
            moment('2000-01-01 00:00:00')
              .startOf('day')
              .seconds(pixelToTimestamp(this.props.cursorPosition.x, this.props.boundaryData, this.props.dimensionsData))
              .format('HH:mm:ss')
          }
        </text>
      );

      return (
        <svg>
          {mouseIndicator}
          {timeText}
        </svg>
      );
    } else {
      return null;
    }
  }
}
