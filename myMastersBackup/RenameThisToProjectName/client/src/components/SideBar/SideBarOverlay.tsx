import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import SideBar from './SideBar';
import SideBarComment from './SideBarComment';
import { connect } from 'react-redux';
import CommentViewMore from './CommentViewMore';
import {
  Transcript,
} from '../Transcript';

import {
  onCommentViewMoreFalse
} from '../../services/Comment';

class SideBarOverlay extends Component<any, any> {

  constructor(props){
      super(props);


      this.state = {key:4};

      this.handleSelect = this.handleSelect.bind(this);
      this.handleViewMore = this.handleViewMore.bind(this);


    }

  handleSelect(key) {
      this.setState({key});
      console.log(key);
      this.props.onCommentViewMoreFalse();
  }

  handleViewMore() {
      console.log(this.state);
  }

  componentWillReceiveProps(){
    if(this.props.comment.commentViewMore){
    this.state = {key:2};}
  }
  // {(this.props.comment.commentViewMore)?  (<Tab eventKey={5} title="View More">  <CommentViewMore/></Tab>):('')}


  render () {

const activeKeyComment = (this.props.comment.commentViewMore)? 2: 4;

return (
  <Tabs  activeKey={this.state.key} onSelect={this.handleSelect.bind(this)} id="controlled-tab-example">
    <Tab eventKey={1} title="Highlights"><SideBar /></Tab>
    <Tab eventKey={2} title="Comments">   { (this.props.comment.commentViewMore)?(<CommentViewMore/>):<SideBarComment />}</Tab>
    <Tab eventKey={3} title="Annotations"> There are no annotations added! </Tab>
    <Tab eventKey={4} title="Transcript"> <Transcript currentTime={this.props.currentTime} onViewMore = {this.handleViewMore.bind(this)} transcriptUpdate = {this.props.transcriptUpdate}/> </Tab>
  </Tabs>
);
}

}

const actions = {
  onCommentViewMoreFalse,
};

function mapStateToProps (state) {
  return {

    comment: state.activeVideo.comment,
      transcriptUpdate: state.activeVideo.transcript.transcriptUpdate,
      transcriptObj: state.activeVideo.transcript.transcriptObj,
      currentTime: state.activeVideo.player.currentTime,

  };
}

export default connect(mapStateToProps, actions)(SideBarOverlay);
