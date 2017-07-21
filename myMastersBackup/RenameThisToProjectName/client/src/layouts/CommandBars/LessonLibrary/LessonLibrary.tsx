import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import {
  SearchBox,
} from 'office-ui-fabric-react/lib/SearchBox';
import styles from './styles.css';

export default class LessonLibraryCommandBar extends Component<any, any> {
  constructor (props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }
  handleSearch = (event) => {
    this.props.callbackFromLessonLibrary(event);
  }
  render () {
    return (
        <div className={styles.container}>
            <SearchBox
                className={styles.searchBox}
                onChange={this.handleSearch}
            />
        </div>
    );
  }
}
