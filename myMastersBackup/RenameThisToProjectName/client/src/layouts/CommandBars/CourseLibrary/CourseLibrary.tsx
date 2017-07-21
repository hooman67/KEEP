import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import {
  SearchBox,
} from 'office-ui-fabric-react/lib/SearchBox';
import {
  DefaultButton,
} from 'office-ui-fabric-react/lib/Button';
import styles from './styles.css';

export default class CourseLibraryCommandBar extends Component<any, any> {
  constructor (props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }
  handleSearch = (event) => {
    this.props.callbackFromCourseLibrary(event);
  }
  render () {
    return (
        <div className={styles.container}>
            <SearchBox
                className={styles.searchBox}
                onChange={this.handleSearch}
            />
            <DefaultButton className={styles.addLesson}
                iconProps={{ iconName: 'Add' }}
                text='Add Lesson'
                onClick={()=> browserHistory.push('/createLesson')}
            />
        </div>
    );
  }
}
