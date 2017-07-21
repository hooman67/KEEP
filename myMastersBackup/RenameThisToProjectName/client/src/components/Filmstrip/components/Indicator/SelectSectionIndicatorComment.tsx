/**
 * SelectSectionIndicatorCommment component display the comment select section
 *
 * @author Sameer Sunani <sam_sunani@outlook.com>
 */
import React, { PureComponent } from 'react';
import {
  ISelectSectionIndicatorComment,
} from '../../types';

export default class SelectSectionIndicatorComment extends PureComponent <ISelectSectionIndicatorComment, null> {
  /**
   * Renders the component.
   *
   * @return {ReactElement} - HTML markup for the component
   */
  render () {
    if (this.props.selectSectionDataComment.display) {
      return (
        <rect
          x={this.props.selectSectionDataComment.display.x}
          y={0}
          width={this.props.selectSectionDataComment.display.width}
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
