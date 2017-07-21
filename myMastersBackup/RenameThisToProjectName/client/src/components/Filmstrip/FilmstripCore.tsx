import React, { Component } from 'react';
import Perf from 'react-addons-perf';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import Filmstrip from './components/Filmstrip';
import styles from './styles.css';
import {
  onHighlightSelectSectionStart,
  onHighlightSelectSectionInProcess,
  onHighlightSelectSectionClear,
  onHighlightSelectSectionEnd,
} from '../../services/Highlight';
import {
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionClear,
  onCommentSelectSectionEnd,
  onCommentSendText
} from '../../services/Comment';
import {
  onVideoPlayerPlayHighlightStart,
  onVideoPlayerSeek,
  onVideoPlayerPlayCommentClick,
} from '../VideoPlayer';
import {
  onFilmstripResize,
} from './Actions';
import {
  filmstripAggregateSelector,
} from './FilmstripSelector';

import {
  onCommentHover,
} from '../../services/Comment/Actions';

class FilmstripCore extends Component<any, any> {
  /*
  componentDidUpdate () {
    Perf.stop();
    Perf.printInclusive();
    Perf.printWasted();
  }
  */
  render () {
    return (
      <Measure
        onMeasure={dimensions => this.props.onFilmstripResize(dimensions)}
      >
        <div className={styles.filmstripCore}>
          {
            !this.props.filmstrip ? null : this.props.filmstrip.map((data) => {
              return (
                <Filmstrip
                  key={data.key}
                  actions={{
                    onVideoPlayerPlayHighlightStart: this.props.onVideoPlayerPlayHighlightStart,
                    onVideoPlayerSeek: this.props.onVideoPlayerSeek,
                    onHighlightSelectSectionStart: this.props.onHighlightSelectSectionStart,
                    onHighlightSelectSectionInProcess: this.props.onHighlightSelectSectionInProcess,
                    onHighlightSelectSectionEnd: this.props.onHighlightSelectSectionEnd,
                    onHighlightSelectSectionClear: this.props.onHighlightSelectSectionClear,
                    onCommentSelectSectionStart: this.props.onCommentSelectSectionStart,
                    onCommentSelectSectionInProcess: this.props.onCommentSelectSectionInProcess,
                    onCommentSelectSectionClear: this.props.onCommentSelectSectionClear,
                    onCommentSelectSectionEnd: this.props.onCommentSelectSectionEnd,
                    onVideoPlayerPlayCommentClick: this.props.onVideoPlayerPlayCommentClick,
                    onCommentHover: this.props.onCommentHover,
                    onCommentSendText: this.props.onCommentSendText,
                  }}
                  inputData={data}
                />
              );
            })
          }
        </div>
      </Measure>
    );
  }
}

const actions = {
  onVideoPlayerSeek,
  onHighlightSelectSectionStart,
  onHighlightSelectSectionInProcess,
  onHighlightSelectSectionClear,
  onHighlightSelectSectionEnd,
  onVideoPlayerPlayHighlightStart,
  onCommentSelectSectionStart,
  onCommentSelectSectionInProcess,
  onCommentSelectSectionClear,
  onCommentSelectSectionEnd,
  onFilmstripResize,
  onVideoPlayerPlayCommentClick,
  onCommentHover,
  onCommentSendText,
};

function mapStateToProps (state) {
  return {
    filmstrip: filmstripAggregateSelector(state),
  };
}

export default connect(mapStateToProps, actions)(FilmstripCore);
