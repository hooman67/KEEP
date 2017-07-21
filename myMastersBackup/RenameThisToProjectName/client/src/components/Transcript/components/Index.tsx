/**
 * Description - Index Component
 * Parent - TranscriptCore.js
 * @author Samprity Kashyap <samprityk2014@gmail.com>
 */

import React, { Component } from 'react';
import { IIndex } from '../types';
import styles from './styles.css';

export default class Index extends Component<IIndex, null> {
  constructor (props: IIndex) {
    super(props);
  }

  render () {
    return (
      <div className={styles.transcriptIndexFont}>
        <button
          className={styles.transcriptbutton}
          onClick={() => this.props.onVideoPlayerSeek(this.props.startTime)}
        >
          [{this.props.formattedTime}]
        </button>
      </div>
    );
  }
}
