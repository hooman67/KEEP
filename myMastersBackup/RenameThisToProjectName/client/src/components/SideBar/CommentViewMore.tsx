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
  onCommentSelectSectionClear,
  onCommentViewMoreFalse
} from '../../services/Comment';

import {SidebarOpen} from '../../layouts/CommandBars/ActiveVideo/sidebarAction';


import styles from './styles.css';


class CommentViewMore extends Component<any, any>  {

  constructor (props: any) {
    super(props);
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


  saveComment(uuid, start, end, parent) {
    const val = (this.refs.newCommentText as HTMLInputElement).value;

    console.log("hs saveComment entered:\n", uuid, "\n",val);

    this.props.onCommentSendText(uuid, start, end, val, parent);
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
          <div>
            <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
            <button onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent)}>Save</button>
          </div>
        );
      }else{
        return(
          <div className={styles.replyBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>

            <div>Hooman Shariati</div>
            <div>At:  {comment.TimeStamp}</div>
            <div>To:  {comment.Parent}</div>
            <br></br>

            <div>{comment.Text}</div>

            <div  style={{'margin-top':'10px'}}>
              <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
              <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
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
                <button style = {{'width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</button>
                <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                  <div>
                    <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
                    <button onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent)}>Save</button>
                  </div>
                  {this.generateCommentsReplies(comment.Replies)}
                </div>
              </div>
              );
            }else{
              return(
              <div>
                <button style = {{'width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</button>
                <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                  <div>Hooman Shariati</div>
                  <div>At:  {comment.TimeStamp}</div>
                  <div>To:  {comment.Parent}</div>
                  <br></br>
                  <div>{comment.Text}</div>

                  {this.generateCommentsReplies(comment.Replies)}
                  <div style={{'margin-top':'10px'}}>
                    <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
                    <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
                    <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
                    <button className='link'  onClick = { () => this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, colorToUpdate, indexToUpdateGlobal)}>
                            Play Segment
                    </button>
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
                  <button style = {{'width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</button>
                  <div>
                      <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
                      <button onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent)}>Save</button>
                  </div>
                </div>
                );
              }else{
                return(
                <div>
                  <button style = {{'width': '100%'}} onClick={() => this.closeViewMore()}>View All Comments</button>
                  <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                    <div>Hooman Shariati</div>
                    <div>At:  {comment.TimeStamp}</div>
                    <div>To:  {comment.Parent}</div>
                    <br></br>
                    <div>{comment.Text}</div>
                    <div style={{'margin-top':'10px'}}>
                      <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
                      <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
                      <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
                      <button className='link'  onClick = { () => this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, colorToUpdate, indexToUpdateGlobal)}>
                              Play Segment
                      </button>
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
