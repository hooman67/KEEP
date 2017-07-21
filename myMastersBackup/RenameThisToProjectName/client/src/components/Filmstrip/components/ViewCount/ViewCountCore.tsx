import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  VictoryArea,
} from 'victory';
import {
  IViewCountCore,
  IFilmstripDimensionsData,
} from '../../types';

export default class ViewCountCore extends Component<IViewCountCore, null> {
  private enlarge: boolean;
  private preEnlarge: boolean;

  constructor (props: IViewCountCore) {
    super(props);
    this.preEnlarge = false;
    this.enlarge = false;
  }

  /**
   * componentWillReceiveProps() life cycle method
   * a simple state machine to change the height
   *
   * @param nextProps
   */
  componentWillReceiveProps (nextProps) {
    const dimensionsData: IFilmstripDimensionsData = this.props.dimensionsData;
    if (nextProps.cursorPosition.isOutside) {
      this.preEnlarge = this.enlarge;
      this.enlarge = false;
    } else if (this.enlarge && nextProps.cursorPosition.y < dimensionsData.generalHeight - (dimensionsData.viewcount.layerHeight * 2)) {
      this.preEnlarge = this.enlarge;
      this.enlarge = false;
    } else if (!this.enlarge && nextProps.cursorPosition.y > dimensionsData.generalHeight - dimensionsData.viewcount.layerHeight) {
      this.preEnlarge = this.enlarge;
      this.enlarge = true;
    }
  }

  render () {
    const { dimensionsData, viewCountData } = this.props;
    // enlarge or not
    let mag: number = 1;
    if (this.enlarge) {
      mag = 2;
    }
    return (
      <div
        className={this.props.className}
        style={{
          height: dimensionsData.viewcount.layerHeight * mag,
          width: dimensionsData.generalWidth,
        }}
      >
        <VictoryArea
          data={viewCountData.data}
          x='time'
          y='count'
          width={dimensionsData.generalWidth}
          height={dimensionsData.viewcount.layerHeight * mag}
          padding={0}
          domain={{ y: [0, viewCountData.maxValue] }}
          style={{
            data: {
              stroke: 'orange',
              opacity: 0.5,
              fill: '#ff8c00',
            },
          }}
        />
      </div>
    );
  }
}
