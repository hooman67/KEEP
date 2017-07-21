import React, { PureComponent } from 'react';
import {
  IFilmstripDimensionsData,
  ICommentProps,
  ICommentData,
} from '../../types';
import {SidebarOpen} from '../../../../layouts/CommandBars/ActiveVideo/sidebarAction';
import uuid from 'uuid';

export default class CommentBoxMapCore extends PureComponent<ICommentProps, any> {

  /**
   * CommentMapCore constructor function
   *
   * @param props
   */
  constructor (props: any) {
    super(props);
    this.saveComment = this.saveComment.bind(this);
  }

  saveComment() {
    const val = (this.refs.newCommentText as HTMLInputElement).value;
    const uuid1 = uuid.v4();
    
    console.log("ss saveComment entered:\n", uuid1, "\n",val);
    this.props.onCommentSendText(uuid1 ,120,140,val);
  }
  /**
   * Renders the component.
   *
   * @return {ReactElement} - HTML markup for the component
   */
  render () {


    return (
    <div 
    className={this.props.className}>
        <textarea ref="newCommentText" style={{ width: 100}}></textarea>
        <button onClick={() => this.saveComment()}>Save</button>
    </div>
    );
  }
}
