import React, { PureComponent } from 'react';
import styles from './styles.css';
import {
  IThumbnail,
  ICommentData
} from '../../types';

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


        onMouseMove ={ () => {
          const tnCommentData: ICommentData[] = this.props.commentData;
          
          tnCommentData.map((data, ) => {
            data.onClickData.showTimeRange = false;
          });

        }}
      />
    );
  }
}
