import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ICommentProps } from './types';
import styles from './styles.css';
import { getCSSColor } from '../Transcript/TranscriptHelpers';
import { onCommentHover, onCommentNotHover } from '../../services/Comment';
import {
  IAction,
  ActionCreator,
} from '../../services/ActionCreator';

import {
  DefaultButton, PrimaryButton, IconButton, IButtonProps
} from 'office-ui-fabric-react/lib/Button';

import ReactTooltip from 'react-tooltip';

import {showCommentIntervalWord, hideCommentIntervalWord} from '../Transcript';

import {SidebarOpen} from '../../layouts/CommandBars/ActiveVideo/sidebarAction';

import {transcriptUpdate} from '../Transcript';

import ThumbnailSorter from '../SideBar/components/ThumbnailSorter';

import {thumbnail} from '../SideBar/components/ThumbnailData';

import {ISingleThumbnailData, IThumbnailData} from '../SideBar/types/IThumbnail';

import ReactCursorPosition from 'react-cursor-position';

class Comment extends Component<ICommentProps, any> {
  constructor (props: any) {
    super(props);
    this.cancelComment = this.cancelComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.replyComment = this.replyComment.bind(this);
    this.generateComments = this.generateComments.bind(this);
    this.generateCommentsReplies = this.generateCommentsReplies.bind(this);
    this.viewMore = this.viewMore.bind(this);
    this.getBackgroundColor = this.getBackgroundColor.bind(this);
    this.calculateThumbnail = this.calculateThumbnail.bind(this);
  }



  editComment(uuid, start, end, parent) {
      this.props.action.onCommentEditText(uuid, start, end, "", parent);
  }

  deleteComment(uuid, start, end, parent) {
    this.props.action.onCommentDeleteText(uuid, start, end, "", parent);
  }

  replyComment(uuid, start, end) {
    //this.props.action.onCommentReply(uuid, start, end, "");
    this.props.action.onCommentSelectSectionEnd(uuid, start, end);
  }

  saveComment(uuid, start, end, parent, timeStamp, previousText) {
    const val = (this.refs.newCommentText as HTMLInputElement).value;

    console.log("hs saveComment entered:\n", uuid, "\n",val);

    this.props.action.onCommentSendText(uuid, start, end, val, previousText, parent, timeStamp);
  }

  cancelComment(uuid, start, end, parent, timeStamp, prevText){
    this.props.action.onCommentCancelText(uuid, start, end, prevText, parent);
  }



  getBackgroundColor (colour, parent) {
  if(parent){
    switch (colour) {
      case "red":
        return '#ffe6e6';
      case "blue":
        return '#e6f5ff';
      case "green":
        return '#ccffcc';
      case "yellow":
        return '#ffffcc';
      default:
        return '#d9d9d9';
    }
  }else{
    switch (colour) {
      case "red":
        return '#ffcccc';
      case "blue":
        return '#80ccff';
      case "green":
        return '#b3ffb3';
      case "yellow":
        return '#ffff99';
      default:
        return '#f4f4f4';
    }
  }

}

  calculateThumbnail(startTime: number): ISingleThumbnailData{
    const thumbnailData: IThumbnailData = thumbnail;
    return thumbnailData.coordinates[Math.floor((startTime / thumbnailData.duration) * thumbnailData.coordinates.length)];
  }

  viewMore(uuid) {
    this.props.action.onCommentViewMore(uuid);
  }

  showInterval(uuid,start, end, color){
    this.props.onCommentHover(uuid, true, color);
    if(this.props.transcriptObj.length > 0){
      this.props.showCommentIntervalWord(start, end);
    }
    this.props.SidebarOpen();
    this.props.transcriptUpdate();
  }

  hideInterval(uuid,start, end, color){
    this.props.onCommentNotHover(uuid, false, color);
    if(this.props.transcriptObj.length > 0){
      this.props.hideCommentIntervalWord(start, end);
    }
    this.props.SidebarOpen();
    this.props.transcriptUpdate();
  }


  generateCommentsReplies(comments, idViewMore){
    const result = (comments).map((comment, index) => {
      const bs = ((new Date()).getTime()*1000);
      const bs2 = (new Date(bs)).toString();
      if (index < 1){
        if(comment.Text == ""){
          return(
            <div style = {{'width': '100%'}}>
              <textarea  ref="newCommentText" defaultValue={comment.Text} style={{backgroundColor:this.getBackgroundColor(comment.Color, false),'color':'black', 'width': '100%'}}></textarea>

               <IconButton
                className={styles.icon}
                iconProps={{ iconName: 'MessageFill' }}
                onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
              />

              <IconButton
                className={styles.icon}
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => this.cancelComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
              />

            </div>
          );
          ///
        }else{
          return(
            <div className={styles.replyBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>

               <div style={{height: 150, width: 200}}>
                 <ReactCursorPosition>
                    <ThumbnailSorter start={comment.start} end={comment.end} />
                  </ReactCursorPosition>
                 </div>
              <div>John Smith</div>
              <div>At:  {comment.TimeStamp}</div>
              <div>To:  {comment.Parent}</div>
              <br></br>

              <div>{comment.Text}</div>

              <div  style={{'margin-top':'10px'}}>
                <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</DefaultButton>
                <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</DefaultButton>
              </div>

            </div>
          );
          ///
        }
    }

    else if (index == 1){
      if(comment.Text == ""){
        return(
          <div style = {{'width': '100%'}}>
            <textarea ref="newCommentText" defaultValue={comment.Text} style={{backgroundColor:this.getBackgroundColor(comment.Color, false),'color':'black', 'width': '100%'}}></textarea>

              <IconButton
                className={styles.icon}
                iconProps={{ iconName: 'MessageFill' }}
                onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
              />

              <IconButton
                className={styles.icon}
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => this.cancelComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
              />

          </div>
        );
        ///
      }else{
      return(
      <div>

          <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.viewMore(idViewMore)}>View More</DefaultButton>
        </div>
      );

    }


  }

  else {
    if(comment.Text == ""){
      return(
        <div style = {{'width': '100%'}}>
          <textarea ref="newCommentText" defaultValue={comment.Text} style={{backgroundColor:this.getBackgroundColor(comment.Color, false),'color':'black', 'width': '100%'}}></textarea>

            <IconButton
              className={styles.icon}
              iconProps={{ iconName: 'MessageFill' }}
              onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
            />

            <IconButton
              className={styles.icon}
              iconProps={{ iconName: 'Cancel' }}
              onClick={() => this.cancelComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
            />

        </div>
      );
      ///
    }

  }

  })
    return(
      <span>
        {result}
      </span>
    );
///
  }



  generateComments(){

    const result = (this.props.comments).map(comment => {

      const bs = ((new Date()).getTime()*1000);
      const bs2 = (new Date(bs)).toString();

      if(comment.Replies){
        if(this.props.commentExpandAll){
          if(comment.Text == "" ){
            return(
              <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                <div style = {{'width': '100%'}}>
                  <textarea ref="newCommentText" defaultValue={comment.Text} style={{backgroundColor:this.getBackgroundColor(comment.Color, false),'color':'black', 'width': '100%'}}></textarea>

                  <IconButton
                    className={styles.icon}
                    iconProps={{ iconName: 'MessageFill' }}
                     onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
                  />

                  <IconButton
                    className={styles.icon}
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={() => this.cancelComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
                  />

                </div>
                {this.generateCommentsReplies(comment.Replies, comment._id)}
              </div>
            );
          }else{
            return(
              <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>

              <div style={{height: 150, width: 200}}>
                <ReactCursorPosition>
                      <ThumbnailSorter start={comment.start} end={comment.end} />
                </ReactCursorPosition>
              </div>

                <div>John Smith</div>
                <div>At:  {comment.TimeStamp}</div>
                <div>To:  {comment.Parent}</div>
                <br></br>
                <div>{comment.Text}</div>

                {this.generateCommentsReplies(comment.Replies, comment._id)}

                    <div style={{'margin-top':'10px'}}>
                    <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</DefaultButton>
                    <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</DefaultButton>
                    <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</DefaultButton>
                    </div>
                  </div>
                  ///
                );
              }
          } else {return(
            <span>

              <IconButton
                      data-tip
                      data-for= {comment._id + "#TS"}
                      onClick = {() => this.viewMore(comment._id)}
                      disabled={ false }
                      iconProps={ { iconName: 'Chat',
                                    style: {
                                              color: '#004578',
                                            }
                                } }
                      title='View Comment'
                      ariaLabel='View Comment'
                      onMouseEnter = {() => this.showInterval(comment._id, comment.start, comment.end, comment.Color)}
                      onMouseLeave = {() => this.hideInterval(comment._id,comment.start, comment.end, comment.Color)}
                      />
              <ReactTooltip id = {comment._id + "#TS"} type='warning' effect = 'solid' place = 'bottom' style={{opacity: 1}}>
                <div>John Smith</div>
                <div>At:  {comment.TimeStamp}</div>
                <div>{comment.Text}</div>
                <div> Number of Replies: {comment.Replies.length}</div>
              </ReactTooltip>

            </span>
          );
        }

      }else{
        if(comment.Text == ""){
          return(
            <div style = {{'width': '100%'}}>
                <textarea ref="newCommentText" defaultValue={comment.Text} style={{backgroundColor:this.getBackgroundColor(comment.Color, false),'color':'black', 'width': '100%'}}></textarea>

                  <IconButton
                    className={styles.icon}
                    iconProps={{ iconName: 'MessageFill' }}
                    onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
                  />

                  <IconButton
                    className={styles.icon}
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={() => this.cancelComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp, comment.PreviousText)}
                  />

            </div>
          );
          ///
        } else{
          if (this.props.commentExpandAll){
            return(
              <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
              <div style={{height: 150, width: 200}}>
                <ReactCursorPosition>
                  <ThumbnailSorter start={comment.start} end={comment.end} />
                </ReactCursorPosition>
              </div>

                <div>John Smith</div>
                <div>At:  {comment.TimeStamp}</div>
                <div>To:  {comment.Parent}</div>
                <br></br>
                <div>{comment.Text}</div>

                <div style={{'margin-top':'10px'}}>
                  <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</DefaultButton>
                  <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</DefaultButton>
                  <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</DefaultButton>
                </div>

              </div>
            );
          }
         else {          ////this is where if for collapse ends
          return(
            <span>
            <IconButton
                data-tip
                data-for= {comment._id + "#TS"}
                onClick = {() => this.viewMore(comment._id)}
                disabled={ false }
                iconProps={ { iconName: 'Chat',
                              style: {
                                        color: '#004578',
                                      }
                          } }
                title='View Comment'
                ariaLabel='View Comment'
                onMouseEnter = {() => this.showInterval(comment._id,comment.start, comment.end, comment.Color)}
                onMouseLeave = {() => this.hideInterval(comment._id,comment.start, comment.end, comment.Color)}
            />
            <ReactTooltip id= {comment._id + "#TS"} type='warning' effect = 'solid' place = 'bottom' style={{opacity: 1}}>
              <div>John Smith</div>
              <div>At:  {comment.TimeStamp}</div>
              <div>{comment.Text}</div>
              <div> Number of Replies: 0</div>
            </ReactTooltip>

              </span>
            );
          }
        }

      }
    })

    return(
      <span>
        {result}
      </span>
    );
///
  }


  render () {
  	return (
      <span>
        {this.generateComments()}
      </span>
    );
    ///
  }

}

const actions = {
  showCommentIntervalWord,
  hideCommentIntervalWord,
  SidebarOpen,
  transcriptUpdate,
  onCommentHover,
  onCommentNotHover,
};

function mapStateToProps (state) {
  return {
      commentExpandAll: state.activeVideo.comment.commentExpandAll,
      transcriptObj: state.activeVideo.transcript.transcriptObj,
  };
}

export default connect(mapStateToProps, actions)(Comment);
