import React, { Component } from 'react';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import styles from './styles.css';
import {
  onVideoPlayerResize,
} from './Actions';
import VideoPlayer from './components/VideoPlayer';

class VideoPlayerCore extends Component<any, any> {
  constructor (props) {
    super(props);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
  }

  renderVideoPlayer () {
    if (this.props.player.dimensions) {
      return (
        <VideoPlayer />
      );
    } else {
      return null;
    }
  }

  render () {
    return (
      <Measure
        onMeasure={dimensions => this.props.onVideoPlayerResize(dimensions)}
      >
        <div className={styles.container}>
          {this.renderVideoPlayer()}
        </div>
      </Measure>
    );
  }
}

const actions = {
  onVideoPlayerResize,
};

function mapStateToProps (state) {
  return {
    player: state.activeVideo.player,
  };
}

export default connect(mapStateToProps, actions)(VideoPlayerCore);
