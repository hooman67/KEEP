import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  SearchBox,
} from 'office-ui-fabric-react/lib/SearchBox';
import {
  Toggle,
} from 'office-ui-fabric-react/lib/Toggle';
import {
  DefaultButton, PrimaryButton, IconButton, IButtonProps
} from 'office-ui-fabric-react/lib/Button';


import {
  onHighlightToggle,
  onHighlightColorSelection,
  onHighlightModeChange,
  onHighlightSetHighlightRemove,
  onHighlightToggleMultipleHighlightRemoval,
  onHighlightRemoveOff,
} from '../../../services/Highlight';
import {
  onCommentToggle,
  onCommentColorSelection,
  onCommentModeChange,
  onCommentSetCommentRemove,
  onCommentToggleMultipleCommentRemoval,
  onCommentRemoveOff,
  onCommentExpandAll,
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
    display: 'Green',
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



  constructor(){
      super();
      this.state = {  comment:false, highlight:false};
      this.clickComment = this.clickComment.bind(this);
      this.clickHighlight = this.clickHighlight.bind(this);
      this.handleClickInspector = this.handleClickInspector.bind(this);
      this.handleClickExpand = this.handleClickExpand.bind(this);
      this.getPrivacyLevle = this.getPrivacyLevle.bind(this);
  }

    getPrivacyLevle(color){
      switch (color) {
        case "red":
          return 'Public';
        case "blue":
          return 'Friends';
        case "green":
          return 'Private';
        case "yellow":
          return 'Instructor';
        default:
          return 'None';
      }
    }

    clickComment(){
      this.setState({comment:!this.state.comment});
      this.props.onCommentModeChange(!this.state.comment);
    }

    clickHighlight(){
      this.setState({highlight:!this.state.highlight})
      this.props.onHighlightModeChange(!this.state.highlight);
    }

    handleClickInspector(){
      this.props.SidebarOpen();
    }

    handleClickExpand(){
      this.props.onCommentExpandAll();
    }

  render () {
    // console.log('hs ActiveVideoCommandBar(ActVid.tsx) this.props:\n', this.props);
    const style1   = { backgroundColor: 'white', width: '40px', minWidth: '40px' };


    const buttonInspector = this.props.isOpen
          ? <PrimaryButton
            disabled={ false }
            styles = {style1}
            text='Inspector'
            onClick={ this.handleClickInspector.bind(this) }>
          </PrimaryButton>
          : <DefaultButton
            disabled={ false }
            styles = {style1}
            text='Inspector'
            onClick={  this.handleClickInspector.bind(this)  }>
          </DefaultButton>;


    const buttonExpandComment = this.props.commentExpandAll
          ? <PrimaryButton
            disabled={ false }
            styles = {style1}
            text='Collapse'
            onClick={ this.handleClickExpand.bind(this) }>
          </PrimaryButton>
          : <DefaultButton
            disabled={ false }
            styles = {style1}
            text='Expand'
            onClick={  this.handleClickExpand.bind(this)  }>
          </DefaultButton>;



///

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





        <div>
          <DefaultButton
            data-automation-id='test'
            disabled={ false }
            checked={ this.state.highlight }
            iconProps={ { 
                          iconName: 'Edit',
                          style: {
                            color: this.props.highlight.activeHighlightColor,
                          }, 
                      } }
            onClick={ this.clickHighlight.bind(this) }
            split={ true }
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
          />
        </div>






        <div>
          <DefaultButton
            data-automation-id='test'
            disabled={ false }
            checked={ this.state.comment }
            iconProps={ { 
                          iconName: 'chat',
                          style: {
                            color: this.props.comment.activeCommentColor,
                          },  
                      } }
            text={this.getPrivacyLevle(this.props.comment.activeCommentColor)}
            onClick={ this.clickComment.bind(this) }
            split={ true }
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
          />
        </div>




        <div className={styles.addSideBarContainer}>
          {buttonExpandComment}
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
  onHighlightModeChange,
  onHighlightSetHighlightRemove,
  onHighlightToggleMultipleHighlightRemoval,
  onHighlightRemoveOff,
  onTranscriptSearch,
  onCommentToggle,
  onCommentColorSelection,
  onCommentSetCommentRemove,
  onCommentToggleMultipleCommentRemoval,
  onCommentRemoveOff,
  SidebarOpen,
  onCommentModeChange,
  onCommentExpandAll,
};

function mapStateToProps (state) {
  return {
    player: state.activeVideo.player,
    highlight: state.activeVideo.highlight,
    comment: state.activeVideo.comment,
    isOpen: state.SidebarReducer.isOpen,
    commentExpandAll: state.activeVideo.comment.commentExpandAll,


  };
}

export default connect(mapStateToProps, actions)(ActiveVideoCommandBar);
