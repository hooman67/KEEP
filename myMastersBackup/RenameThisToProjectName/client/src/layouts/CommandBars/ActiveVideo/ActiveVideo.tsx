import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  SearchBox,
} from 'office-ui-fabric-react/lib/SearchBox';
import {
  Toggle,
} from 'office-ui-fabric-react/lib/Toggle';
import {
  DefaultButton, PrimaryButton
} from 'office-ui-fabric-react/lib/Button';
import {
  onHighlightToggle,
  onHighlightColorSelection,
  onHighlightSetHighlightRemove,
  onHighlightToggleMultipleHighlightRemoval,
  onHighlightRemoveOff,
} from '../../../services/Highlight';
import {
  onCommentToggle,
  onCommentColorSelection,
  onCommentSetCommentRemove,
  onCommentToggleMultipleCommentRemoval,
  onCommentRemoveOff,
} from '../../../services/Comment';
import {
  onTranscriptSearch,
} from '../../../components/Transcript';
import {
  onVideoPlayerPlayHighlightStart,
  onVideoPlayerPlayCommentClick
} from '../../../components/VideoPlayer';
import styles from './styles.css';
import {SidebarOpen} from './sidebarAction';


const colorArray = [
  {
    name: 'red',
    display: 'Red',
  },
  {
    name: 'blue',
    display: 'Blue',
  },
  {
    name: 'green',
    display: 'Greent',
  },
  {
    name: 'yellow',
    display: 'Yellow',
  },
  {
    name: 'purple',
    display: 'Purple',
  },
];

const commentPrivacyArray = [
  {
    name: 'red',
    display: 'Public',
  },
  {
    name: 'blue',
    display: 'Friends',
  },
  {
    name: 'green',
    display: 'Private',
  },
  {
    name: 'yellow',
    display: 'Instructor',
  },
];

class ActiveVideoCommandBar extends Component<any, any> {

  handleClick()
  {

    this.props.SidebarOpen();

  }


  render () {
    // console.log('hs ActiveVideoCommandBar(ActVid.tsx) this.props:\n', this.props);
    return (
      <div className={styles.container}>
        <SearchBox
          className={styles.searchBox}
          onChange={(searchString) => {
            this.props.onTranscriptSearch(searchString.split(' '));
          }}
        />
        <div className={styles.toggleContainer}>
          <div className={styles.toggleLabel}>
            Display Highlight
          </div>
          <Toggle
            className={styles.toggle}
            defaultChecked={true}
            onText='On'
            offText='Off'
            onChanged={this.props.onHighlightToggle}
          />
        </div>
        <div className={styles.playHighlightContainer}>
          <DefaultButton
            iconProps={
              {
                iconName: 'Play',
                style: {
                  color: this.props.player.highlightColor,
                },
              }
            }
            text='Play Highlight'
            menuProps={
              {
                items: colorArray.map((color) => {
                  return {
                    key: color.name,
                    name: color.display,
                    iconProps: {
                      iconName: 'Color',
                      style: {
                        color: color.name,
                      },
                    },
                    onClick: () => (this.props.onVideoPlayerPlayHighlightStart(this.props.highlight.highlightData[color.name], color.name)),
                  };
                }),
              }
            }
          >
          </DefaultButton>
        </div>
          <div className={styles.playHighlightContainer}>
          <DefaultButton
            iconProps={
              {
                iconName: 'Play',
                style: {
                  color: this.props.player.commentColor,
                },
              }
            }
            text='Play Comment'
            menuProps={
              {
                items: colorArray.map((color) => {
                  return {
                    key: color.name,
                    name: color.display,
                    iconProps: {
                      iconName: 'Color',
                      style: {
                        color: color.name,
                      },
                    },
                    onClick: () => (this.props.onVideoPlayerPlayCommentClick(this.props.comment.commentData, color.name)),
                  };
                }),
              }
            }
          >
          </DefaultButton>
        </div>
        <div className={styles.addHighlightContainer}>
          <DefaultButton
            iconProps={
              {
                iconName: 'Edit',
                style: {
                  color: this.props.highlight.activeHighlightColor,
                },
              }
            }
            text='Add Highlight'
            menuProps={
              {
                items: colorArray.map((color) => {
                  return {
                    key: color.name,
                    name: color.display,
                    iconProps: {
                      iconName: 'Color',
                      style: {
                        color: color.name,
                      },
                    },
                    onClick: () => (this.props.onHighlightColorSelection(color.name)),
                  };
                }),
              }
            }
          >
          </DefaultButton>
        </div>
        <div className={styles.removeHighlightContainer}>
          <DefaultButton
            iconProps={ { iconName: 'Remove' } }
            text='Remove Highlight'
            menuProps={
              {
                items: [
                  {
                    key: 'single',
                    name: 'Single Color',
                    onClick: this.props.onHighlightSetHighlightRemove,
                  },
                  {
                    key: 'all',
                    name: 'All Color',
                    onClick: this.props.onHighlightToggleMultipleHighlightRemoval,
                  },
                  {
                    key: 'none',
                    name: 'None',
                    onClick: this.props.onHighlightRemoveOff,
                  },
                ],
              }
            }
          >
          </DefaultButton>
        </div>
        <div className={styles.addCommentContainer}>
          <DefaultButton
            iconProps={
              {
                iconName: 'Edit',
                style: {
                  color: this.props.comment.activeCommentColor,
                },
              }
            }
            text='Add Comment'
            menuProps={
              {
                items: commentPrivacyArray.map((color) => {
                  return {
                    key: color.name,
                    name: color.display,
                    iconProps: {
                      iconName: 'Color',
                      style: {
                        color: color.name,
                      },
                    },
                    onClick: () => (this.props.onCommentColorSelection(color.name)),
                  };
                }),
              }
            }
          >
          </DefaultButton>
        </div>
        <div className={styles.removeCommentContainer}>
          <DefaultButton
            iconProps={ { iconName: 'Remove' } }
            text='Remove Comment'
            menuProps={
              {
                items: [
                  {
                    key: 'single',
                    name: 'Single Color',
                    onClick: this.props.onCommentSetCommentRemove,
                  },
                  {
                    key: 'all',
                    name: 'All Color',
                    onClick: this.props.onCommentToggleMultipleCommentRemoval,
                  },
                  {
                    key: 'none',
                    name: 'None',
                    onClick: this.props.onCommentRemoveOff,
                  },
                ],
              }
            }
          >
          </DefaultButton>
          </div>
        <div className={styles.addSideBarContainer}>
          <PrimaryButton
          text='SideBar'
          onClick={this.handleClick.bind(this)}/>
        </div>
      </div>
    );
  }
}

const actions = {
  onHighlightToggle,
  onVideoPlayerPlayHighlightStart,
  onVideoPlayerPlayCommentClick,
  onHighlightColorSelection,
  onHighlightSetHighlightRemove,
  onHighlightToggleMultipleHighlightRemoval,
  onHighlightRemoveOff,
  onTranscriptSearch,
  onCommentToggle,
  onCommentColorSelection,
  onCommentSetCommentRemove,
  onCommentToggleMultipleCommentRemoval,
  onCommentRemoveOff,
  SidebarOpen
};

function mapStateToProps (state) {
  return {
    player: state.activeVideo.player,
    highlight: state.activeVideo.highlight,
    comment: state.activeVideo.comment,
  };
}

export default connect(mapStateToProps, actions)(ActiveVideoCommandBar);
