/**
 * SelectSectionIndicator component display the highlight select section
 *
 * @author Junyuan Zheng <joseph.zjy@gmail.com>
 */
import React, { PureComponent } from 'react';
import {
  ISelectSectionIndicator,
} from '../../types';

export default class SelectSectionIndicator extends PureComponent <ISelectSectionIndicator, null> {
  /**
   * Renders the component.
   *
   * @return {ReactElement} - HTML markup for the component
   */
  render () {
    if (this.props.selectSectionDataHighlight.display) {
      return (
        <rect
          x={this.props.selectSectionDataHighlight.display.x}
          y={0}
          width={this.props.selectSectionDataHighlight.display.width}
          height={this.props.dimensionsData.indicator.layerHeight}
          fill='blue'
          opacity={0.3}
        />
      );
    } else {
      return null;
    }
  }
}
