import React, { PureComponent } from 'react';
import styles from './styles.css';
import {
  IThumbnail,
} from '../types/IThumbnail';

export default class Thumbnail extends PureComponent<IThumbnail, null> {
  render () {
    return (
      <div
        className={styles.columns}
        style={{
          height: this.props.dimensions.height,
          width: this.props.dimensions.width,
          backgroundImage: `url(${this.props.src})`,
          // TODO: REAL VALUE
          backgroundPosition: `${this.props.data.x / (this.props.data.width * 3) * 100}% ${this.props.data.y / (this.props.data.height * 34) * 100}%`,
          backgroundSize: '400% 3500%',
        }}
      />
    );
  }
}
