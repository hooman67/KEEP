import React, { PureComponent } from 'react';
import {
  ITimestampIndicator,
} from '../../types';

export default class TimestampIndicator extends PureComponent <ITimestampIndicator, null> {
  render () {
    // if current timestamp is out filmstrip timestamp range then return null
    if (this.props.currentTimeData) {
      return (
        <rect
          x={this.props.currentTimeData - 1.5}
          y={0}
          width={3}
          height={this.props.dimensionsData.indicator.layerHeight}
          fill='#2196f3'
          opacity={0.7}
        />
      );
    } else {
      return null;
    }
  }
}
