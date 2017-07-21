import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import {
  DefaultNavigationBar,
} from '../../layouts/NavigationBars';
import {
  DefaultTemplate,
} from '../../layouts/Templates';
import {
  DefaultSideBar,
} from '../../layouts/SideBars';
import * as actions from './Actions';
import {
  LessonLibraryCommandBar,
} from '../../layouts/CommandBars';
import { lessonLibrarySelector } from './LessonLibrarySelector';
import styles from './styles.css';

class LessonLibrary extends Component<any, any> {
  private sidebar;
  private commandbar;

  constructor () {
    super();
    this.sidebar = {
      groups: [{
        links: [
          {
            name: 'Week1',
            onClick: () => (console.log('Click Week1')),
          },
          {
            name: 'Week2',
            onClick: () => (console.log('Click Week2')),
          },
        ],
      }],
      expanded: 'expanded',
      collapsed: 'collapsed',
    };
  }

  componentWillMount () {
    this.props.onLessonLibraryFetch(this.props.params.id);
    this.props.onLessonLibrarySearch('');
    this.renderLessonList = this.renderLessonList.bind(this);
  }

  renderLessonList () {
    return (
      this.props.courseLessons.map((lesson, index) => {
        return (
          <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-xxl2'>
            <div className={styles.container}>
              <img className={styles.image} src='http://via.placeholder.com/500x500'/>
              <div className={styles.caption}>
                <Label>
                  Name: {lesson.Name}
                </Label>
                <div className='ms-font-s'>
                  Summary: {lesson.Summary}
                </div>
              </div>
              <div className={styles.button}>
                <Link to={`lesson/${lesson._id}`} style={{ textDecoration: 'none' }}>
                  <PrimaryButton
                    text='Go to Lesson'
                  />
                </Link>
              </div>
            </div>
          </div>
        );
      })
    );
  }
  searchCallback = (value) => {
    this.props.onLessonLibrarySearch(value);
  }
  render () {
    const data = {
      header: <DefaultNavigationBar/>,
      commandbar: <LessonLibraryCommandBar callbackFromLessonLibrary={this.searchCallback}/>,
      content: (
        <div className='ms-Grid'>
          <div className='ms-Grid-row'>
            {this.renderLessonList()}
          </div>
        </div>
      ),
      sidebar: <DefaultSideBar {...this.sidebar}/>,
    };
    return (
      <DefaultTemplate {...data}/>
    );
  }
}
/**
 * Maps state to props
 * @constructor
 * @param state - redux state
 */
function mapStateToProps (state) {
  return {
    // lessonLibrary: state.lessonLibrary,
    courseLessons: lessonLibrarySelector(state),
  };
}

export default connect(mapStateToProps, actions)(LessonLibrary);
