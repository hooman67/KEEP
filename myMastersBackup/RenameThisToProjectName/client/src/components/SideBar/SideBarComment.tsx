import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import HighlightedWords  from './hWords';
import SideBarCommentText from './SideBarCommentText';

class SideBarComment extends Component<any, any> {


render () {

  if(this.props.comment.commentData)
  {
      if((this.props.comment.commentData.red && this.props.comment.commentData.red.length > 0  )||
         (this.props.comment.commentData.blue && this.props.comment.commentData.blue.length > 0 )||
         (this.props.comment.commentData.green && this.props.comment.commentData.green.lenth > 0 )||
         (this.props.comment.commentData.yellow && this.props.comment.commentData.yellow.length > 0 )||
         (this.props.comment.commentData.purple && this.props.comment.commentData.purple.length > 0))

              {
                        const dSize = this.props.isOpen ? '300px' : '0px';
                        const sSize = this.props.isOpen ? null : '0%';
                        const rSize: boolean = this.props.isOpen ? true : false;
                        let renderHighlighted: any;
                        let highlightTextStart:any;
                        let highlightTextEnd: any;
                        let highlightedWords: any;

                        let listCommentsRed: any;
                        let listCommentsBlue: any;
                        let listCommentsGreen: any;
                        let listCommentsYellow: any;
                        let listCommentsPurple: any;


                        let i;


                        if (this.props.comment.commentData.red[0] != null)
                        {
                        listCommentsRed = this.props.comment.commentData.red.map(function(comments, index){

                                return(

                                  <SideBarCommentText text = {comments.Text} commentIndex = {index} />
                                )}
                              );
                            } else
                          {
                            listCommentsRed = null;
                          };


                          if (this.props.comment.commentData.green[0] != null)
                          {
                          listCommentsGreen = this.props.comment.commentData.green.map(function(comments){

                                  return(

                                    <p> {comments.text}</p>
                                  )}
                                );
                              } else
                            {
                              listCommentsGreen = null;
                            };

                            if (this.props.comment.commentData.yellow[0] != null)
                            {
                            listCommentsYellow = this.props.comment.commentData.yellow.map(function(comments){

                                    return(

                                      <p> {comments.text}</p>
                                    )}
                                  );
                                } else
                              {
                                listCommentsYellow = null;
                              };


                          const divStyleRed = { backgroundColor: '#ffcccc'};
                          const divStyleBlue = { backgroundColor: '#80ccff'};
                          const divStyleGreen = { backgroundColor: '#b3ffb3'};
                          const divStyleYellow = { backgroundColor: '#ffff99'};
                          const divStylePurple = { backgroundColor: '#d1b3ff'};


                          return (

                                          <div>
                                            <div style = {divStyleRed}> {listCommentsRed} </div>
                                            <div style = {divStyleGreen}> {listCommentsGreen} </div>
                                            <div style = {divStyleYellow}> {listCommentsYellow} </div>


                                          </div>

                            );
                          }

                else {

                          return (

                                          <div><p> {'Empty'} </p> </div>


                            );
                      }
  }
  else {


            return (


                            <div><p> {'Empty'} </p> </div>


              );
        };

};



}

function mapStateToProps (state) {
  return {
    container: state.activeVideo.container,
    highlight: state.activeVideo.highlight,
    comment: state.activeVideo.comment,
    viewcount: state.activeVideo.viewcount,
    currentTime: state.activeVideo.player.currentTime,
      isOpen: state.SidebarReducer.isOpen,
      transcriptObj: state.activeVideo.transcript.transcriptObj,

  };
}

export default connect(mapStateToProps)(SideBarComment);
