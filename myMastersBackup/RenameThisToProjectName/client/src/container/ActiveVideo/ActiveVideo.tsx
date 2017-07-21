import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import HighlightedWords  from '../../components/SideBar/hWords';
import {
  DefaultNavigationBar,
} from '../../layouts/NavigationBars';
import {
  ActiveVideoCommandBar,
} from '../../layouts/CommandBars';
import {
  onActiveVideoInit,
} from './Actions';
import {
  onViewCountFetch,
  onViewCountUpdate,
} from '../../services/ViewCount';
import {
  onHighlightUpdate,
} from '../../services/Highlight';
import {
  onCommentUpdate,
} from '../../services/Comment';
import {
  VideoPlayer,
} from '../../components/VideoPlayer';
import {
  Transcript,
} from '../../components/Transcript';
import {
  Filmstrip,
} from '../../components/Filmstrip';
import styles from './styles.css';

import SideBar from '../../components/SideBar/SideBar';
import SideBarOverlay from '../../components/SideBar/SideBarOverlay';

class ActiveVideo extends Component<any, any> {
  componentWillMount () {
    this.props.onActiveVideoInit(this.props.params.id);
    this.props.onViewCountFetch(this.props.params.id);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.highlight.highlightUpdate.remove || nextProps.highlight.highlightUpdate.create) {
      const highlightUpdate = nextProps.highlight.highlightUpdate;
      this.props.onHighlightUpdate(this.props.params.id, highlightUpdate.remove, highlightUpdate.create);
    }
    if (nextProps.comment.commentUpdate.edit || nextProps.comment.commentUpdate.remove || nextProps.comment.commentUpdate.create) {
      console.log('hs onCommentUpdate called from ActiveVideo.tsx');
      const commentUpdate = nextProps.comment.commentUpdate;
      this.props.onCommentUpdate(this.props.params.id, commentUpdate.remove, commentUpdate.create, commentUpdate.edit);
    }
    if (nextProps.viewcount.newViewCounts.length > 0) {
      this.props.onViewCountUpdate(this.props.params.id, nextProps.viewcount.newViewCounts);
    }
  }

  render () {
    const dSize = this.props.isOpen ? '308px' : '0px';
    const sSize = this.props.isOpen ? null : '0%';
    const rSize: boolean = this.props.isOpen ? true : false;

                            return (
                                      <div className={styles.root}>
                                        <div className={styles.header}>
                                          <DefaultNavigationBar />
                                          <ActiveVideoCommandBar />
                                        </div>

                                        <div className={styles.content}>
                                          <SplitPane split='vertical' size = {dSize} maxSize = {dSize} >
                                            <div>
                                              <SideBarOverlay />

                                            </div>
                                            <SplitPane split="vertical" defaultSize="50%">
                                              <SplitPane split='horizontal' defaultSize='70%' className='primary'>
                                                <VideoPlayer />
                                                <Filmstrip />
                                              </SplitPane>
                                              <Transcript currentTime={this.props.currentTime} />
                                            </SplitPane>
                                          </SplitPane>
                                          </div>
                                        </div>

                              );
                            }


  }



const actions = {
  onActiveVideoInit,
  onHighlightUpdate,
  onCommentUpdate,
  onViewCountFetch,
  onViewCountUpdate,
};

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

export default connect(mapStateToProps, actions)(ActiveVideo);
