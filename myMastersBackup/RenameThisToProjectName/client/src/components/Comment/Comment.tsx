import React, { Component } from 'react';
import { ICommentProps } from './types';
import styles from './styles.css';
import { getCSSColor } from '../Transcript/TranscriptHelpers';

import * as actions from '../../services/Comment/ActionTypes';
import {
  IAction,
  ActionCreator,
} from '../../services/ActionCreator';

export default class Comment extends Component<ICommentProps, any> {
  constructor (props: any) {
    super(props);
    this.saveComment = this.saveComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.replyComment = this.replyComment.bind(this);
    this.generateComments = this.generateComments.bind(this);
    this.generateCommentsReplies = this.generateCommentsReplies.bind(this);
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


  saveComment(uuid, start, end, parent) {
    const val = (this.refs.newCommentText as HTMLInputElement).value;

    console.log("hs saveComment entered:\n", uuid, "\n",val);

    this.props.action.onCommentSendText(uuid, start, end, val, parent);
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
          <div className={styles.replyBlock}>
            {/*<h5>Parent: {comment.Parent}</h5>*/}
            {comment.Text}
            <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
            <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
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




 /* generateComments(){
    const result = (this.props.comments).map(comment => {
      if(comment.Replies){
        return(
          <div className={styles.commentBlock}>
            {comment.Text}
            {this.generateCommentsReplies(comment.Replies)}
            <div>
            <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
            <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
            <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
            </div>
          </div>
        );

      }else{
        if(comment.Text == ""){
          return(
            <div className={styles.commentBlock}>
                <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
                <button onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent)}>Save</button>
              </div>
          );
        }else{
          return(
            <div className={styles.commentBlock}>
              {comment.Text}
              <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
              <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
              <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
            </div>
          );
        }
      }

    })
    return(
      <span>
        {result}
      </span>
    );
  	
  }*/


  generateComments(){
    const result = (this.props.comments).map(comment => {
      if(comment.Replies){
        if(comment.Text == "" ){
          return(
            <div className={styles.commentBlock}>
              <div>
                <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
                <button onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent)}>Save</button>
              </div>
              {this.generateCommentsReplies(comment.Replies)}
            </div>
          );
        }else{
          return(
            <div className={styles.commentBlock}>
              {comment.Text}
              {this.generateCommentsReplies(comment.Replies)}
              <div>
              <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
              <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
              <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
              </div>
            </div>
          );
        }

      }else{
        if(comment.Text == ""){
          return(
            <div>
                <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
                <button onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent)}>Save</button>
            </div>
          );
        }else{
          return(
            <div className={styles.commentBlock}>
              {comment.Text}
              <button onClick={() => this.editComment(comment._id, comment.start, comment.end, comment.Parent)}>Edit</button>
              <button onClick={() => this.deleteComment(comment._id, comment.start, comment.end, comment.Parent)}>Delete</button>
              <button onClick={() => this.replyComment(comment._id, comment.start, comment.end)}>Reply</button>
            </div>
          );
        }
      }

    })
    return(
      <span>
        {result}
      </span>
    );
    
  }

  render () {
  	return (
        <span
          onMouseDown={this.props.action.onMousedownHandler}
          onMouseUp={this.props.action.onMouseupHandler}
          onMouseMove={this.props.action.onMouseMoveHandler}>
          	{this.generateComments()}
        </span>
    );
  }
}
