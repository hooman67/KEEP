import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onVideoPlayerPlayCommentClick
} from '../../components/VideoPlayer/Actions';

import {
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionEnd,
  onCommentSendText,
  onCommentEditText,
  onCommentDeleteText,
  onCommentCancelText,
  onCommentSelectSectionClear,
  onCommentViewMoreFalse
} from '../../services/Comment';

import {SidebarOpen} from '../../layouts/CommandBars/ActiveVideo/sidebarAction';

import {thumbnail} from './components/ThumbnailData';

import {ICursorPosition} from '../../types';

import ReactCursorPosition from 'react-cursor-position';

import {ISingleThumbnailData, IThumbnailData} from './types/IThumbnail';

import ThumbnailSorter from './components/ThumbnailSorter';

import {
  DefaultButton, PrimaryButton, IconButton, IButtonProps
} from 'office-ui-fabric-react/lib/Button';

import styles from './styles.css';


class CommentViewMore extends Component<any, any>  {

  constructor (props: any) {
    super(props);
    this.cancelComment = this.cancelComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.replyComment = this.replyComment.bind(this);
    this.generateCommentsReplies = this.generateCommentsReplies.bind(this);
    this.getBackgroundColor = this.getBackgroundColor.bind(this);

  }



  editComment(uuid, start, end, parent) {
      this.props.onCommentEditText(uuid, start, end, "", parent);
  }

  deleteComment(uuid, start, end, parent) {
    this.props.onCommentDeleteText(uuid, start, end, "", parent);
  }

  replyComment(uuid, start, end) {
    //this.props.action.onCommentReply(uuid, start, end, "");
    this.props.onCommentSelectSectionEnd(uuid, start, end);
  }

  saveComment(uuid, start, end, parent, timeStamp, previousText) {
    const val = (this.refs.newCommentText as HTMLInputElement).value;

    console.log("hs saveComment entered:\n", uuid, "\n",val);

    this.props.onCommentSendText(uuid, start, end, val, previousText, parent, timeStamp);
  }

  cancelComment(uuid, start, end, parent, timeStamp, prevText){
    this.props.onCommentCancelText(uuid, start, end, prevText, parent);
  }


  closeViewMore() {
    //this.props.action.onCommentReply(uuid, start, end, "");
    this.props.onCommentViewMoreFalse();
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




  generateCommentsReplies(comments){
    const result = (comments).map(comment => {
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
      }else{
        return(
          <div className={styles.replyBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>

            <div>John Smith</div>
            <div>At:  {comment.TimeStamp}</div>
            <div>To:  {comment.Parent}</div>
            <br></br>

            <div>{comment.Text}</div>

            <div  style={{'margin-top':'10px'}}>
              <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</DefaultButton>
              <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</DefaultButton>
            </div>

          </div>
        );
      }
    })
    return(
      <span>
        {result}
      </span>
    );

  }

  /**
 * @return Thumbnail coordinate information
 */

  calculateThumbnail(startTime: number): ISingleThumbnailData{
    const thumbnailData: IThumbnailData = thumbnail;
    return thumbnailData.coordinates[Math.floor((startTime / thumbnailData.duration) * thumbnailData.coordinates.length)];
  }



render(){



if(this.props.comment.commentData && this.props.comment.commentViewMoreId && this.props.comment.commentData){
const commentViewId = this.props.comment.commentViewMoreId;


let indexToUpdate;

let currentCommentArray = this.props.comment.commentData;
let indexToUpdateGlobal;
let colorToUpdate;

// Determine at which index in books array is the book to be deleted

for (let key in currentCommentArray) {
  if (currentCommentArray.hasOwnProperty(key)) {
    indexToUpdate =
    currentCommentArray[key].findIndex(
    function(comment){
    return comment._id === commentViewId;
    }
  )
  if (indexToUpdate !== -1){
    indexToUpdateGlobal = indexToUpdate;
    colorToUpdate = key;
    break;
  } else {
    indexToUpdateGlobal = indexToUpdate;
  }
}
}



  if (indexToUpdateGlobal !== -1)    {

    const commentArr = this.props.comment.commentData[colorToUpdate];
    const comment = commentArr[indexToUpdateGlobal]
    if(comment.Replies){
            if(comment.Text == "" ){
              return(
              <div>
                <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px','width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</DefaultButton>
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
                  {this.generateCommentsReplies(comment.Replies)}
                </div>
              </div>
              );
            }else{
              return(
              <div>
                <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px','width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</DefaultButton>
                <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                  <div onClick = { () => this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, this.props.Color, this.props.commentIndex)} style={{height: 150, width: 200}}>
                        <ReactCursorPosition>
                          <ThumbnailSorter start={comment.start} end={comment.end} />
                        </ReactCursorPosition>
                  </div>
                  <div>John Smith</div>
                  <div>At:  {comment.TimeStamp}</div>
                  <div>To:  {comment.Parent}</div>
                  <br></br>
                  <div>{comment.Text}</div>

                  {this.generateCommentsReplies(comment.Replies)}
                  <div style={{'margin-top':'10px'}}>
                    <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</DefaultButton>
                    <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</DefaultButton>
                    <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</DefaultButton>
                  </div>
                </div>
              </div>
              );
            }
    }


    else{


      if(comment.Text == ""){
                return(
                <div>
                  <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px','width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</DefaultButton>
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
                </div>
                );
              }else{
                return(
                <div>
                  <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px','width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</DefaultButton>
                  <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                    <div onClick = { () => this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, this.props.Color, this.props.commentIndex)} style={{height: 150, width: 200}}>
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
                      <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</DefaultButton>
                      <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</DefaultButton>
                      <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}} onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</DefaultButton>
                    </div>
                  </div>
                </div>
                );
              }

    }
    }


else { return (<div>'Empty'</div>)};
}
 else { return (<div>'Empty'</div>)}
}
}
const actions = {

  onVideoPlayerPlayCommentClick,
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionEnd,
  onCommentSendText,
  onCommentEditText,
  onCommentDeleteText,
  onCommentCancelText,
  onCommentSelectSectionClear,
  SidebarOpen,
  onCommentViewMoreFalse,
};

function mapStateToProps (state) {
  return {
    player: state.activeVideo.player,
    comment: state.activeVideo.comment,
  };
}

export default connect(mapStateToProps, actions)(CommentViewMore)
