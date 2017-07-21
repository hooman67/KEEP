import React, { PureComponent } from 'react';
import SelectIndicator from './SelectSectionIndicator';
import SelectSectionIndicatorComment from './SelectSectionIndicatorComment';
import TimestampIndicator from './TimestampIndicator';
import TimeMarkIndicator from './TimeMarkIndicator';
import MouseIndicator from './MouseIndicator';
import { IIndicatorCore } from '../../types';

export default class IndicatorCore extends PureComponent <IIndicatorCore, null> {
  render () {
    return (
      <svg
        height={this.props.dimensionsData.indicator.layerHeight}
        width={this.props.dimensionsData.generalWidth}
        className={this.props.className}
      >
        <defs>
          <filter x='0' y='0' width='1' height='1' id='background'>
            <feFlood floodColor='gray'/>
            <feComposite in='SourceGraphic'/>
          </filter>
        </defs>

        <SelectSectionIndicatorComment
          dimensionsData={this.props.dimensionsData}
          selectSectionDataComment={this.props.indicatorData.selectSectionDataComment} 
        />
        
        <TimestampIndicator
          dimensionsData={this.props.dimensionsData}
          currentTimeData={this.props.indicatorData.currentTimeData}
        />
        <TimeMarkIndicator
          markerData={this.props.indicatorData.markerData}
        />
        <MouseIndicator
          dimensionsData={this.props.dimensionsData}
          boundaryData={this.props.boundaryData}
          cursorPosition={this.props.cursorPosition}
        />
      </svg>
    );
  }
}
