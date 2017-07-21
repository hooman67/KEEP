import React, { PureComponent } from 'react';
import {
  IFilmstripDimensionsData,
  ICommentCore,
  ICommentData,
} from '../../types';
import {SidebarOpen} from '../../../../layouts/CommandBars/ActiveVideo/sidebarAction';

export default class CommentMapCore extends PureComponent<ICommentCore, any> {
  private enlarge: boolean;
  private preEnlarge: boolean;

  /**
   * CommentMapCore constructor function
   *
   * @param props
   */
  constructor (props: ICommentCore) {
    super(props);
    this.preEnlarge = false;
    this.enlarge = false;
  }

    /**
   * hoverComment() method for showing the comment attributes
   *
   * @return Alert
   */

  onMouseEnterHandler(commentData: ICommentData){
    console.log("onMouseEnterHandler");
    this.props.onCommentHover();
  }

      /**
   * hoverComment() method for showing the comment attributes
   *
   * @return Alert
   */

  onMouseLeaveHandler(){
    console.log("Leaving the comment");
  }

    /**
   * componentWillReceiveProps() life cycle method
   * a simple state machine to change the height
   * of the entire CommentCore
   * @param nextProps
   */

  componentWillReceiveProps (nextProps: ICommentCore) {
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
    const commentData: ICommentData[] = this.props.commentData;

    // enlarge or not
    let mag: number = 1;
    if (this.enlarge) {
      mag = 2;
    }

    return (
      <svg
        className={this.props.className}
        width={dimensionsData.generalWidth}
        height={dimensionsData.comment.layerHeight * mag}
      >
        {
          commentData.map((data) => {
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
                onMouseEnter = {this.onMouseEnterHandler.bind(this)}
                onMouseLeave = {this.onMouseLeaveHandler}
                onClick={() => this.props.onVideoPlayerPlayCommentClick(
                  [
                    {
                      start: data.onClickData.start,
                      end: data.onClickData.end,
                      Text: data.onClickData.Text,
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
