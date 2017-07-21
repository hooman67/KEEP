import React, { Component } from 'react';
import styles from './styles.css';

export default class ActiveVideoNavigationBar extends Component<any, any> {
  render () {
    return (
      <div className={styles.navigationBar}>
        <div className='logo ms-font-xl'>
          <strong>{this.props.name}</strong>
        </div>
      </div>
    );
  }
}
