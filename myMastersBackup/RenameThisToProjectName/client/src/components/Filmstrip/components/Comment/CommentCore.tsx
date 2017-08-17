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

import {onCommentViewMoreTrue, onCommentHover, onCommentNotHover} from '../../../../services/Comment';
import { connect } from 'react-redux';


import {showCommentIntervalWord, hideCommentIntervalWord} from '../../../Transcript';

import {transcriptUpdate} from '../../../Transcript';



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

  onCommentHover(data: any, start, end){
    this.props.onCommentHover(data.onClickData._id, true, data.fill);
    // console.log(data);

    if(this.props.transcriptObj.length > 0){
      this.props.showCommentIntervalWord(start, end);
    }
    console.log(start, end, 'Entered show interval function');
    this.props.transcriptUpdate();

  }

  onCommentHoverLeave(data:any, start, end){
    // console.log(data);
    this.props.onCommentNotHover(data.onClickData._id, false, data.fill);

    if(this.props.transcriptObj.length > 0){
      this.props.hideCommentIntervalWord(start, end);
    }
    console.log('Entered hide');
    this.props.transcriptUpdate();

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
            if(data.onClickData.showTimeRange == false){
             return(
              <div
              onMouseEnter ={ () => this.onCommentHover(data, data.onClickData.start, data.onClickData.end)}
              onMouseLeave ={ () => this.onCommentHoverLeave(data, data.onClickData.start, data.onClickData.end)}
              onClick = {() => this.onCommentDoubleClick(data.onClickData._id)}
              data-tip data-for={data.onClickData._id}
                >
               <IconButton
                  key={index}
                  style={{position: 'absolute', left: data.x, top: data.y}}
                  disabled={ false }
                  iconProps={ { iconName: 'MessageFill' } }
                  text={data.onClickData.Text}
                  onDoubleClick={ () => this.onClickComment(data)}
                  />

              </div>
              );
            }else if(data.onClickData.showTimeRange == true){
              const commentwidth = data.width;
              const commentoffset = data.x;
              const color = data.fill;
              let numberOfReplies;
              if(data.onClickData.Replies){
                numberOfReplies = data.onClickData.Replies.length;
              }else{
                numberOfReplies = "couldn't determine";
              }

              return(
               <div>
                  <div
                  onMouseLeave ={ () => this.onCommentHoverLeave(data, data.onClickData.start, data.onClickData.end)}
                  onClick = {() => this.onCommentDoubleClick(data.onClickData._id)}
                  style={{background: color, width: commentwidth, left: commentoffset, position: 'absolute'}}
                  data-tip data-for={data.onClickData._id}
                  onDoubleClick={ () => this.onClickComment(data)}
                  > .
                   </div>

                  <ReactToolTip id={data.onClickData._id} type='warning' effect = 'solid' place = 'bottom'>
                    <div>John Smith</div>
                    <div>At:  {data.onClickData.TimeStamp}</div>
                    <div>{data.onClickData.Text}</div>
                    <div>Number of Replies: {numberOfReplies}</div>
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
  onCommentHover,
  onCommentNotHover,
  transcriptUpdate,
  showCommentIntervalWord,
  hideCommentIntervalWord,
};

function mapStateToProps (state) {
  return {
      transcriptObj: state.activeVideo.transcript.transcriptObj,
  };
}

export default connect(mapStateToProps, actions)(CommentMapCore);
