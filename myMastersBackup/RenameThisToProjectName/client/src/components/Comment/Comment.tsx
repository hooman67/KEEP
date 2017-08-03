import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ICommentProps } from './types';
import styles from './styles.css';
import { getCSSColor } from '../Transcript/TranscriptHelpers';

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


class Comment extends Component<ICommentProps, any> {
  constructor (props: any) {
    super(props);
    this.saveComment = this.saveComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.replyComment = this.replyComment.bind(this);
    this.generateComments = this.generateComments.bind(this);
    this.generateCommentsReplies = this.generateCommentsReplies.bind(this);
    this.viewMore = this.viewMore.bind(this);
    this.getBackgroundColor = this.getBackgroundColor.bind(this);
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


  saveComment(uuid, start, end, parent, timeStamp) {
    const val = (this.refs.newCommentText as HTMLInputElement).value;

    console.log("hs saveComment entered:\n", uuid, "\n",val);

    this.props.action.onCommentSendText(uuid, start, end, val, parent, timeStamp);
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


  viewMore(uuid) {

    console.log("View More entered:\n");

    this.props.action.onCommentViewMore(uuid);
  }

  showInterval(start, end){
    this.props.showCommentIntervalWord(start, end);
    console.log(start, end, 'Entered show interval function');
    this.props.SidebarOpen();
    this.props.transcriptUpdate();

  }

  hideInterval(start, end){
    this.props.hideCommentIntervalWord(start, end);
    console.log('Entered hide');
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
            <div>
              <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
              <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp)}>Save</DefaultButton>
            </div>
          );
          ///
        }else{
          return(
            <div className={styles.replyBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>

              <div>Hooman Shariati</div>
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
          <div>
            <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
            <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp)}>Save</DefaultButton>
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
        <div>
          <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
          <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp)}>Save</DefaultButton>
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
                <div>
                  <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
                  <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp)}>Save</DefaultButton>
                </div>
                {this.generateCommentsReplies(comment.Replies, comment._id)}
              </div>
            );
          }else{
            return(
              <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                <div>Hooman Shariati</div>
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
                      onDoubleClick = {() => this.viewMore(comment._id)}
                      disabled={ false }
                      iconProps={ { iconName: 'Chat',
                                    style: {
                                              color: '#004578',
                                            }
                                } }
                      title='View Comment'
                      ariaLabel='View Comment'
                      onMouseEnter = {() => this.showInterval(comment.start, comment.end)}
                      onMouseLeave = {() => this.hideInterval(comment.start, comment.end)}
                      />
              <ReactTooltip id = {comment._id + "#TS"} type='warning' effect = 'solid' place = 'bottom' style={{opacity: 1}}>
                <div>Hooman Shariati</div>
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
            <div>
                <textarea ref="newCommentText" defaultValue={comment.Text}></textarea>
                <DefaultButton style={{'border':'2px #ccc solid', 'margin':'1px'}}  onClick={() => this.saveComment(comment._id, comment.start, comment.end, comment.Parent, comment.TimeStamp)}>Save</DefaultButton>
            </div>
          );
          ///
        } else{
          if (this.props.commentExpandAll){
            return(
              <div className={styles.commentBlock} style={{backgroundColor: this.getBackgroundColor(comment.Color, comment.Parent)}}>
                <div>Hooman Shariati</div>
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
                onDoubleClick = {() => this.viewMore(comment._id)}
                disabled={ false }
                iconProps={ { iconName: 'Chat',
                              style: {
                                        color: '#004578',
                                      }
                          } }
                title='View Comment'
                ariaLabel='View Comment'
                onMouseEnter = {() => this.showInterval(comment.start, comment.end)}
                onMouseLeave = {() => this.hideInterval(comment.start, comment.end)}
            />
            <ReactTooltip id= {comment._id + "#TS"} type='warning' effect = 'solid' place = 'bottom' style={{opacity: 1}}>
              <div>Hooman Shariati</div>
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
};

function mapStateToProps (state) {
  return {
      commentExpandAll: state.activeVideo.comment.commentExpandAll,
  };
}

export default connect(mapStateToProps, actions)(Comment);
