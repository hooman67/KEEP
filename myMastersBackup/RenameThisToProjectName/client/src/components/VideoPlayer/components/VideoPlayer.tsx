import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  onVideoPlayerInit,
  onVideoPlayerPlayNextHighlightInterval,
  onVideoPlayerPlayNextCommentInterval,
  onVideoPlayerUpdateCurrentTime,
  onVideoPlayerDestory,
} from '../Actions';
import {
  onViewCountServiceRegister,
  onViewCountServiceUnRegister,
  onViewCountUpdateCurrentTime,
} from '../../../services/ViewCount';

class VideoPlayer extends Component<any, any> {
  videoPlayer: any;

  constructor (props) {
    super(props);
    this.onVideoPlayerTimeUpate = _.throttle(this.onVideoPlayerTimeUpate, 1000);
  }

  componentDidMount () {
    this.videoPlayer = amp(
      'video',
      {
        playbackSpeed: {
          enabled: true,
          initialSpeed: 1,
          speedLevels: [
            { name: '2.0x', value: 2 },
            { name: '1.0x', value: 1 },
            { name: '0.5x', value: 0.5 },
          ],
        },
        autoplay: true,
        controls: true,
      },
      () => {
        this.props.onVideoPlayerInit(this.videoPlayer);
        this.props.onViewCountServiceRegister();

        this.videoPlayer.on('timeupdate', () => {
          this.onVideoPlayerTimeUpate();
        });
      },
    );
    this.videoPlayer.width(this.props.player.dimensions.width);
    this.videoPlayer.height(this.props.player.dimensions.height);
    this.videoPlayer.src([{
      src: 'https://research.hct.ece.ubc.ca/myview/tlef/videos/ubc/apsc160/Arrays_I_VGA_10fps_keyint10_64kbps.mp4',
      type: 'video/mp4',
    }]);
  }

  onVideoPlayerTimeUpate () {
    const timeStamp = this.videoPlayer.currentTime();
    const highlightEndTime = this.props.player.highlightEndTime;
    const isHighlightedPlaying = this.props.player.isHighlightedPlaying;

    const commentEndTime = this.props.player.commentEndTime;
    const isCommentedPlaying = this.props.player.isCommentedPlaying;

    // if (isHighlightedPlaying) {
    //   if (timeStamp > highlightEndTime) {
    //     this.props.onVideoPlayerPlayNextHighlightInterval();
    //   } else {
    //     this.props.onVideoPlayerUpdateCurrentTime(timeStamp);
    //   }
    // } else {
    //   this.props.onVideoPlayerUpdateCurrentTime(timeStamp);
    // }

    if (isCommentedPlaying) {
      if (timeStamp > commentEndTime) {
        this.props.onVideoPlayerPlayNextCommentInterval();
      } else {
        this.props.onVideoPlayerUpdateCurrentTime(timeStamp);
      }
    } else {
      this.props.onVideoPlayerUpdateCurrentTime(timeStamp);
    }


    this.props.onViewCountUpdateCurrentTime(timeStamp);
  }

  componentWillUnmount () {
    this.videoPlayer.dispose();
    this.props.onVideoPlayerDestory();
    this.props.onViewCountServiceUnRegister();
  }

  render () {
    return (
      <video id='video' className='azuremediaplayer amp-default-skin' />
    );
  }
}

const actions = {
  onVideoPlayerInit,
  onVideoPlayerUpdateCurrentTime,
  onVideoPlayerDestory,
  onVideoPlayerPlayNextHighlightInterval,
  onVideoPlayerPlayNextCommentInterval,
  onViewCountUpdateCurrentTime,
  onViewCountServiceRegister,
  onViewCountServiceUnRegister,
};

function mapStateToProps (state) {
  return {
    highlight: state.activeVideo.highlight,
    player: state.activeVideo.player,
  };
}

export default connect(mapStateToProps, actions)(VideoPlayer);
