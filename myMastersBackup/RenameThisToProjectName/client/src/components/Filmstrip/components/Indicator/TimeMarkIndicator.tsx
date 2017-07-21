import React, { PureComponent } from 'react';
import {
  ITimemarkIndicator,
} from '../../types';

export default class TimeMarkIndicator extends PureComponent <ITimemarkIndicator, null> {
  render () {
    return (
      <svg>
        {
          this.props.markerData.map((data) => {
            return (
              <text
                key={data.key}
                x={data.x}
                y={data.y}
                fill='white'
                fontSize='x-small'
                filter='url(#background)'
              >
                {data.content}
              </text>
            );
          })
        }
      </svg>
    );
  }
};
