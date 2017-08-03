import React, { PureComponent } from 'react';
import { DefaultButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {
  VictoryArea,
} from 'victory';
import ReactToolTip from 'react-tooltip';
import {
  IFilmstripDimensionsData,
  ICommentCore,
  ICommentData,
} from '../../types';
import ColorPicker from '../../../ColorPicker';

import {onCommentViewMoreTrue} from '../../../../services/Comment';
import { connect } from 'react-redux';

// import {editCommentFilmStrip} from '../../../../services/Comment';

class CommentMapCore extends PureComponent<ICommentCore, any> {
  private enlarge: boolean;
  private preEnlarge: boolean;
  private count: number;

  /**
   * CommentMapCore constructor function
   *
   * @param props
   */
  constructor (props: ICommentCore) {
    super(props);
    this.preEnlarge = false;
    this.enlarge = false;
    this.count = 1;
  }

  onClickComment(data: any){
    this.props.cancelCommentEditFilmstrip();
    const id = data.onClickData._id;
    const start = data.onClickData.start;
    const end = data.onClickData.end;
    const commentText  = data.onClickData.Text;
    const Parent = data.onClickData.Parent;
    const TimeStamp = data.onClickData.TimeStamp;
    const color = data.fill
    //send the information to the comment information to the colorpickerstate
    this.props.editCommentFilmStrip(id, start, end, commentText, Parent, TimeStamp, color);
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

  onCommentHover(data: any, index: any){
    data.showTimeRange= true;
    // console.log(data);
  }

  onCommentHoverLeave(data:any, index: any){
    data.showTimeRange = false;
    // console.log(data);
  }

  onCommentDoubleClick(uuid){
    this.props.onCommentViewMoreTrue(uuid);
    // console.log(data);
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
      <div
        className={this.props.className}
      >
        {
          commentData.map((data, index) => {
            if(data.showTimeRange == false){
             return(
              <div
              onMouseEnter ={ () => this.onCommentHover(data, this)}
              onMouseLeave ={ () => this.onCommentHoverLeave(data, this)}
              onDoubleClick = {() => this.onCommentDoubleClick(data.onClickData._id)}
              data-tip data-for={data.onClickData._id}
                >
               <IconButton
                  key={index}
                  style={{position: 'absolute', left: data.x, top: data.y}}
                  disabled={ false }
                  iconProps={ { iconName: 'MessageFill' } }
                  text={data.onClickData.Text}
                  onClick={ () => this.onClickComment(data)}
                  />

              </div>
              );
            }else if(data.showTimeRange == true){
              const commentwidth = data.width;
              const commentoffset = data.x;
              const color = data.fill;

              return(
               <div>
                  <div
                  onMouseLeave ={ () => this.onCommentHoverLeave(data, this)}
                  onDoubleClick = {() => this.onCommentDoubleClick(data.onClickData._id)}
                  style={{background: color, width: commentwidth, left: commentoffset, position: 'absolute'}}
                  data-tip data-for={data.onClickData._id}
                  onClick={ () => this.onClickComment(data)}
                  > .
                   </div>
                  
                  <ReactToolTip id={data.onClickData._id} type='warning' effect = 'solid' place = 'bottom'>
                    <div>Hooman Shariati</div>
                    <div>At:  {data.onClickData.TimeStamp}</div>
                    <div>{data.onClickData.Text}</div>
                  </ReactToolTip>
               </div>




              );
            }

          })

        }

      </div>
    );

  }
}

const actions = {
  onCommentViewMoreTrue,
};

export default connect(null, actions)(CommentMapCore);
