import React, { Component } from 'react';
import {Tabs, Tab, Navbar, Nav, NavItem} from 'react-bootstrap';
import SideBar from './SideBar';
import SideBarComment from './SideBarComment';
import { connect } from 'react-redux';
import CommentViewMore from './CommentViewMore';
import {
  Transcript,
  transcriptWidth
} from '../Transcript';



import {
  onCommentViewMoreFalse
} from '../../services/Comment';
import styles from './styles.css';

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
const left = window.innerWidth - (this.props.transcriptWidth) -20;
const navbarInstance = (
  <Navbar  style = {{top: '90px', left: (left), width: (this.props.transcriptWidth)}}  fixedTop pullRight>

      <Nav bsStyle="pills"  activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
        <NavItem eventKey={1} title="Highlights">Highlights</NavItem>
        <NavItem eventKey={2} title="Comments">Comments</NavItem>
        <NavItem eventKey={3} title="Annotations">Annotations</NavItem>
        <NavItem eventKey={4} title="Transcript"> Transcript</NavItem>
      </Nav>

  </Navbar>
);

let display;

if (this.state.key == 1){
  display = <SideBar />
}
else if (this.state.key == 2){
  display =  (this.props.comment.commentViewMore)?(<CommentViewMore/>):<SideBarComment />

}

else if (this.state.key == 3){
  display = <div>There are no annotations added! </div>
}

else if (this.state.key == 4){
  display = <Transcript currentTime={this.props.currentTime} onViewMore = {this.handleViewMore.bind(this)} transcriptUpdate = {this.props.transcriptUpdate}/>
}


return (
  <div>
  {navbarInstance}
  <div style = {{position: 'relative', top: '50px'}}>
    {display}
  </div>
  </div>
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
      transcriptWidth: state.activeVideo.transcript.transcriptWidth,
      currentTime: state.activeVideo.player.currentTime,

  };
}

export default connect(mapStateToProps, actions)(SideBarOverlay);
