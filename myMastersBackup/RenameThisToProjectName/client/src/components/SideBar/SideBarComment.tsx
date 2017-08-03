import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import HighlightedWords  from './hWords';
import SideBarCommentText from './SideBarCommentText';

class SideBarComment extends Component<any, any> {


render () {

  if(this.props.comment.commentData)
  {
      if((this.props.comment.commentData.red && (this.props.comment.commentData.red.length > 0)  ) || (this.props.comment.commentData.blue && (this.props.comment.commentData.blue.length > 0) )|| (this.props.comment.commentData.green && (this.props.comment.commentData.green.length > 0) ) || (this.props.comment.commentData.yellow && (this.props.comment.commentData.yellow.length > 0) )||  (this.props.comment.commentData.purple && (this.props.comment.commentData.purple.length > 0) ))

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


                        if (this.props.comment.commentData.red && this.props.comment.commentData.red.length > 0)
                        {
                        listCommentsRed = this.props.comment.commentData.red.map(function(comments, index){

                                return(

                                  <SideBarCommentText text = {comments.Text} commentIndex = {index} commentID = {comments._id} Color = 'red' commentArr = {comments}/>
                                )}
                              );
                            } else
                          {
                            listCommentsRed = <span></span>;
                          };


                          if (this.props.comment.commentData.green[0] != null)
                          {
                          listCommentsGreen = this.props.comment.commentData.green.map(function(comments, index){

                                  return(

                                    <SideBarCommentText text = {comments.Text} commentIndex = {index} commentID = {comments._id} Color = 'green' commentArr = {comments}/>
                                  )}
                                );
                              } else
                            {
                              listCommentsGreen = <span></span>;
                            };

                            if (this.props.comment.commentData.yellow[0] != null)
                            {
                            listCommentsYellow = this.props.comment.commentData.yellow.map(function(comments, index){

                                    return(

                                      <SideBarCommentText text = {comments.Text} commentIndex = {index} commentID = {comments._id} Color = 'yellow' commentArr = {comments}/>

                                    )}
                                  );
                                } else
                              {
                                listCommentsYellow = <span></span>;
                              };

                              if (this.props.comment.commentData.blue[0] != null)
                              {
                              listCommentsBlue = this.props.comment.commentData.blue.map(function(comments, index){

                                      return(

                                        <SideBarCommentText text = {comments.Text} commentIndex = {index} commentID = {comments._id} Color = 'blue' commentArr = {comments}/>

                                      )}
                                    );
                                  } else
                                {
                                  listCommentsBlue = <span></span>;
                                };


                          const divStyleRed = { backgroundColor: '#ffcccc'};
                          const divStyleBlue = { backgroundColor: '#80ccff'};
                          const divStyleGreen = { backgroundColor: '#b3ffb3'};
                          const divStyleYellow = { backgroundColor: '#ffff99'};
                          const divStylePurple = { backgroundColor: '#d1b3ff'};


                          return (

                                          <div>
                                            <div > {listCommentsRed} </div>
                                            <div > {listCommentsGreen} </div>
                                            <div > {listCommentsYellow} </div>
                                            <div > {listCommentsBlue} </div>

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
