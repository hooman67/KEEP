import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { List } from 'office-ui-fabric-react/lib/List';
import { IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as actions from './Actions';
import { courseLibrarySelector } from './CourseLibrarySearchSelector';
import styles from './styles.css';

import {
  DefaultSideBar,
} from '../../layouts/SideBars';
import {
  DefaultNavigationBar,
} from '../../layouts/NavigationBars';
import {
  DefaultTemplate,
} from '../../layouts/Templates';
import {
  CourseLibraryCommandBar,
} from '../../layouts/CommandBars';

class CourseLibrary extends Component<any, any> {
  private sidebar;
  private commandbar;
  constructor (props) {
    super(props);
  }

  componentWillMount () {
    this.props.onCourseLibraryFetch();
    this.props.onCourseLibrarySearch('');
    this.renderCourseList = this.renderCourseList.bind(this);
    this.sidebar = {
      groups: [{
        links: [
          {
            name: 'My Course',
            links: [
              {
                name: 'Last Active',
                onClick: () => (console.log('Click Last Active')),
              },
              {
                name: 'Updates',
                onClick: () => (console.log('Click Updates')),
              },
            ],
            isExpanded: true,
          },
        ],
      }],
      expanded: 'expanded',
      collapsed: 'collapsed',
    };
  }

  renderCourseList = () => (
    <div className={styles.container}>
      <List
        items={this.props.courseLibrary}
        onRenderCell={(course, index) => (
          <div className={styles.itemCell}>
            <div className={styles.parent}>
              <div className={styles.content}>
                <Image
                  className={styles.itemImage}
                  src='http://via.placeholder.com/80x80'
                  width={80}
                  height={80}
                  imageFit={ImageFit.cover}
                />
                <div className={styles.itemContent}>
                  <Label className={styles.itemName}>Name: {course.Name}</Label>
                  <Label className={styles.itemName}>Owner: {course.Owner}</Label>
                </div>
              </div>
              <div className={styles.button}>
                <Link to={`course/${course._id}`} style={{ textDecoration: 'none' }}>
                  <PrimaryButton
                    text='Go to Course'
                  />
                </Link>
              </div>
            </div>
            <div className={styles.moreButton}>
              <IconButton
                iconProps={ { iconName: 'More' } }
                menuProps={
                  {
                    items: [
                      {
                        key: 'courseInformation',
                        name: 'Course Information',
                      },
                    ],
                  }
                }
              />
            </div>
          </div>
        )}
      />
    </div>
  )
  searchCallback = (value) => {
    this.props.onCourseLibrarySearch(value);
  }
  render () {
    const data = {
      header: <DefaultNavigationBar/>,
      commandbar: <CourseLibraryCommandBar callbackFromCourseLibrary={this.searchCallback}/>,
      sidebar: <DefaultSideBar {...this.sidebar}/>,
      content: this.renderCourseList(),
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
    // courseLibrary: state.courseLibrary,
    courseLibrary: courseLibrarySelector(state),
  };
}

export default connect(mapStateToProps, actions)(CourseLibrary);
