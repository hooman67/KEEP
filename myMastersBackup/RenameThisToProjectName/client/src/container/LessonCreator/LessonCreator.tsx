import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
  DefaultCommandBar,
} from '../../layouts/CommandBars';
import {
  DefaultSideBar,
} from '../../layouts/SideBars';
import {
  DefaultNavigationBar,
} from '../../layouts/NavigationBars';
import {
  DefaultTemplate,
} from '../../layouts/Templates';
import styles from './styles.css';

class LessonCreator extends Component<any, any> {

  componentWillMount () {
    // check if user is teacher and has permissions by calling server
  }

  handleVideoFiles (files) {
    console.log('Selected ' + files[0]);
  }

  renderForm = () => {
    let videoFileHtmlInput: HTMLInputElement;
    // ToDo cross-check with Azure Media Services support, this is a subset
    const acceptedVideoFileTypes = 'video/mp4,video/mpeg,video/x-ms-wmv,video/x-ms-asf,video/avi';
    return <Grid className={styles.lessonContainer}>
        <Row>
          <h3>Add Lesson</h3>
        </Row>
        <Row>
          <TextField className={styles.lessonTitle} placeholder='Title'/>
        </Row>
        <Row>
          <TextField multiline rows={5} className={styles.lessonSummary} placeholder='Lesson summary' maxLength={400}/>
        </Row>
        <Row>
          <input type='file' id={styles.videoUpload}
            accept={acceptedVideoFileTypes}
            ref={input => videoFileHtmlInput = input}
            onChange={(files) => this.handleVideoFiles(files)}
            />
          <DefaultButton text='Upload video' onClick={() => videoFileHtmlInput.click()} />
          <Label className={styles.videoLabel} />
        </Row>
        <Row>
          <Dropdown
            label='Add to existing course'
            options={
              [
                { key: '0', text: 'Advanced Arrays I' },
                { key: '1', text: 'Advanced Arrays II' },
                { key: '2', text: 'Super-Advanced Arrays for Experts' },
              ]
            }
          />
          <TextField className={styles.newCourse} label='Or create a new course' />
        </Row>
        <Row>
          <PrimaryButton text='Create lesson'/>
        </Row>
      </Grid>;
  }

  render () {
    const commandbar = {
      searchBoxVisible: false,
      searchPlaceholderTex: 'Searching',
      items: [],
    };
    const data = {
      header: <DefaultNavigationBar/>,
      commandbar: <DefaultCommandBar {...commandbar} />,
      sidebar: <DefaultSideBar />,
      content: this.renderForm(),
    };
    return (
      <DefaultTemplate {...data} />
    );
  }
}
/**
 * Maps state to props
 * @constructor
 * @param state - redux state
 */
function mapStateToProps (state) {
  return { videoLibrary: state.videoLibrary };
}

function actions () { return {}; }

export default connect(mapStateToProps, actions)(LessonCreator);
