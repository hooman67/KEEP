import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onVideoPlayerPlayCommentClick
} from '../VideoPlayer/Actions';

class SideBarCommentText extends Component<any, any>  {


render(){




  return(
    <div>
      <p>{this.props.text}</p>
      <p>{this.props.commentIndex}</p>
      <button className='link' >
              Reply
      </button>
      <button className='link' >
              Delete
      </button>
      <button className='link'  onClick = { () => this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, 'red', this.props.commentIndex)}>
              Play Segment
      </button>

    </div>
  );
  }
}

const actions = {

  onVideoPlayerPlayCommentClick,
};

function mapStateToProps (state) {
  return {
    player: state.activeVideo.player,
    comment: state.activeVideo.comment,
  };
}

export default connect(mapStateToProps, actions)(SideBarCommentText)
