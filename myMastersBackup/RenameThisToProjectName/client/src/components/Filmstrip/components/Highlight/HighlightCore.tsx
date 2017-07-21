import React, { PureComponent } from 'react';
import {
  IFilmstripDimensionsData,
  IHighlightCore,
  IHighlightData,
} from '../../types';

export default class HighlightMapCore extends PureComponent<IHighlightCore, null> {
  private enlarge: boolean;
  private preEnlarge: boolean;

  /**
   * HighlightMapCore constructor function
   *
   * @param props
   */
  constructor (props: IHighlightCore) {
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
  componentWillReceiveProps (nextProps: IHighlightCore) {
    const dimensionsData: IFilmstripDimensionsData = this.props.dimensionsData;
    if (nextProps.cursorPosition.isOutside) {
      this.preEnlarge = this.enlarge;
      this.enlarge = false;
    } else if (this.enlarge && nextProps.cursorPosition.y > dimensionsData.highlight.layerHeight * 2) {
      this.preEnlarge = this.enlarge;
      this.enlarge = false;
    } else if (!this.enlarge && nextProps.cursorPosition.y < dimensionsData.highlight.layerHeight) {
      this.preEnlarge = this.enlarge;
      this.enlarge = true;
    }
  }

  /**
   * Renders the component.
   *
   * @return {ReactElement} - HTML markup for the component
   */
  render () {
    const dimensionsData: IFilmstripDimensionsData = this.props.dimensionsData;
    const highlightData: IHighlightData[] = this.props.highlightData;

    // enlarge or not
    let mag: number = 1;
    if (this.enlarge) {
      mag = 2;
    }

    return (
      <svg
        className={this.props.className}
        width={dimensionsData.generalWidth}
        height={dimensionsData.highlight.layerHeight * mag}
      >
        {
          highlightData.map((data) => {
            return (
              <rect
                key={data.key}
                x={data.x}
                y={data.y * mag * dimensionsData.generalHeight}
                width={data.width}
                height={data.height * mag * dimensionsData.generalHeight}
                fill={data.fill}
                stroke='white'
                strokeWidth={0.5}
                strokeOpacity={0.9}
                fillOpacity={0.9}
                onClick={() => this.props.onVideoPlayerPlayHighlightStart(
                  [
                    {
                      start: data.onClickData.start,
                      end: data.onClickData.end,
                    },
                  ],
                  data.fill,
                )}
              />
            );
          })
        }
      </svg>
    );
  }
}
