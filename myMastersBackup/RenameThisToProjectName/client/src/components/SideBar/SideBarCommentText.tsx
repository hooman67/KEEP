import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onVideoPlayerPlayCommentClick
} from '../VideoPlayer/Actions';

import {
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionEnd,
  onCommentSendText,
  onCommentEditText,
  onCommentDeleteText,
  onCommentSelectSectionClear,
} from '../../services/Comment';

import styles from './styles.css';


class SideBarCommentText extends Component<any, any>  {

  constructor (props: any) {
    super(props);
    this.saveComment = this.saveComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.replyComment = this.replyComment.bind(this);
    this.generateCommentsReplies = this.generateCommentsReplies.bind(this);

  }

  editComment(uuid, start, end) {
    this.props.onCommentEditText(uuid, start, end, "");
  }

  deleteComment(uuid, start, end) {
    this.props.onCommentDeleteText(uuid, start, end, "");
  }

  saveComment(uuid, start, end, parent) {
    const val = (this.refs.newCommentText2 as HTMLInputElement).value;

    console.log("hs saveComment entered:\n", uuid, "\n",val);

    this.props.onCommentSendText(uuid, start, end, val, parent);
  }

replyComment(uuid, start, end) {
  //this.props.action.onCommentReply(uuid, start, end, "");
  this.props.onCommentSelectSectionEnd(uuid, start, end);
}


generateCommentsReplies(comments){
  const result = (comments).map(comment => {
    return(
      <div className={styles.replyBlock}>
        <h5>Parent: {comment.Parent}</h5>
        {comment.Text}
        <button onClick={() => this.editComment(comment._id, comment.start, comment.end)}>Edit</button>
        <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end)}>Delete</button>
      </div>
    );
  })
  return(
    <span>
      {result}
    </span>
  );

}


render(){

const commentID = this.props.commentID;
const commentIndex = this.props.commentIndex;
const commentStart = this.props.commentStart;
const commentEnd = this.props.commentEnd;
const comment = this.props.commentArr;


if(comment.Replies){
  return(
    <div className={styles.commentBlock}>
      {comment.Text}
      {this.generateCommentsReplies(comment.Replies)}
      <div>
      <button onClick={() => this.editComment(comment._id, comment.start, comment.end)}>Edit</button>
      <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end)}>Delete</button>
      <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
      <button className='link'  onClick = { () => this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, 'red', this.props.commentIndex)}>
              Play Segment
      </button>
      </div>
    </div>
  );

}else{


if(this.props.text == ""){
  return(
    <div>
        <textarea ref="newCommentText2" ></textarea>
        <button onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent)}>Save</button>
      </div>
  );
}else{
  return(
    <div>
      <p>{this.props.text}</p>
      <button onClick={() => this.editComment(commentID, commentStart, commentEnd)}>Edit</button>
      <button onClick={() => this.deleteComment(commentID, commentStart, commentEnd)}>Delete</button>
      <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
      <button className='link'  onClick = { () => this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, 'red', this.props.commentIndex)}>
              Play Segment
      </button>

    </div>
  );
}

}
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

};

function mapStateToProps (state) {
  return {
    player: state.activeVideo.player,
    comment: state.activeVideo.comment,
  };
}

export default connect(mapStateToProps, actions)(SideBarCommentText)
