import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import HighlightedWords  from './hWords';


class SideBar extends Component<any, any> {


render () {

  if(this.props.highlight.highlightData != null)
  {
      if(this.props.highlight.highlightData.red[0] != null ||
         this.props.highlight.highlightData.blue[0] != null ||
         this.props.highlight.highlightData.green[0] != null ||
         this.props.highlight.highlightData.yellow[0] != null ||
         this.props.highlight.highlightData.purple[0] != null)

              {
                        const dSize = this.props.isOpen ? '300px' : '0px';
                        const sSize = this.props.isOpen ? null : '0%';
                        const rSize: boolean = this.props.isOpen ? true : false;
                        let renderHighlighted: any;
                        let highlightTextStart:any;
                        let highlightTextEnd: any;
                        let highlightedWords: any;

                        let listHighlightsRed: any;
                        let listHighlightsBlue: any;
                        let listHighlightsGreen: any;
                        let listHighlightsYellow: any;
                        let listHighlightsPurple: any;


                        let i;


                        if (this.props.highlight.highlightData.red[0] != null)
                        {
                        listHighlightsRed = this.props.highlight.highlightData.red.map(function(hlights){

                                return(

                                  <HighlightedWords hStart = {hlights.start} hEnd = {hlights.end}/>
                                )}
                              );
                            } else
                          {
                            listHighlightsRed = null;
                          };


                          if (this.props.highlight.highlightData.green[0] != null)
                          {
                          listHighlightsGreen = this.props.highlight.highlightData.green.map(function(hlights){

                                  return(

                                    <HighlightedWords hStart = {hlights.start} hEnd = {hlights.end}/>
                                  )}
                                );
                              } else
                            {
                              listHighlightsGreen = null;
                            };

                            if (this.props.highlight.highlightData.blue[0] != null)
                            {
                            listHighlightsBlue = this.props.highlight.highlightData.blue.map(function(hlights){

                                    return(

                                      <HighlightedWords hStart = {hlights.start} hEnd = {hlights.end}/>
                                    )}
                                  );
                                } else
                              {
                                listHighlightsBlue = null;
                              };

                              if (this.props.highlight.highlightData.yellow[0] != null)
                              {
                              listHighlightsYellow = this.props.highlight.highlightData.yellow.map(function(hlights){

                                      return(

                                        <HighlightedWords hStart = {hlights.start} hEnd = {hlights.end}/>
                                      )}
                                    );
                                  } else
                                {
                                  listHighlightsYellow = null;
                                };

                                if (this.props.highlight.highlightData.purple[0] != null)
                                {
                                listHighlightsPurple = this.props.highlight.highlightData.purple.map(function(hlights){

                                        return(

                                          <HighlightedWords hStart = {hlights.start} hEnd = {hlights.end}/>
                                        )}
                                      );
                                    } else
                                  {
                                    listHighlightsPurple = null;
                                  };


                          const divStyleRed = { backgroundColor: '#ffcccc'};
                          const divStyleBlue = { backgroundColor: '#80ccff'};
                          const divStyleGreen = { backgroundColor: '#b3ffb3'};
                          const divStyleYellow = { backgroundColor: '#ffff99'};
                          const divStylePurple = { backgroundColor: '#d1b3ff'};


                          return (

                                          <div>
                                            <div style = {divStyleRed}> {listHighlightsRed} </div>
                                            <div style = {divStyleGreen}> {listHighlightsGreen} </div>
                                            <div style = {divStyleYellow}> {listHighlightsYellow} </div>
                                            <div style = {divStyleBlue}> {listHighlightsBlue} </div>
                                            <div style = {divStylePurple}> {listHighlightsPurple} </div>

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

export default connect(mapStateToProps)(SideBar);
