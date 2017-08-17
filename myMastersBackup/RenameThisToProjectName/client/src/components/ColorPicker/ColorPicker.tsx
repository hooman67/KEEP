import React, {CSSProperties, Component} from 'react';
import {connect} from 'react-redux';
import {GithubPicker} from 'react-color';
import styles from './styles.css';
import { IColorPicker} from './types';
import { DefaultButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import {
    onCommentSendFilmStripText,
    onCommentCancelText,
} from '../../services/Comment';

import {
  IAction,
  ActionCreator,
} from '../../services/ActionCreator';
 
import { timestampToPixel } from '../Filmstrip/FilmstripHelper';

import uuid from 'uuid';

class ColorPicker extends Component<IColorPicker, any>{
    constructor(props: any){
        super(props);
        this.state = {
          value: null,
        };
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getBackgroundColor = this.getBackgroundColor.bind(this);

    }
    
    shouldComponentUpdate (nextProps: IColorPicker) {
    return (
      (this.props.selectSection.status === 'start' && nextProps.selectSection.status === 'end') || 
      (this.props.selectSection.status === 'start' && nextProps.selectSection.status ==='free' && this.props.colorPickerDisplay && (this.props.colorPickerData!=null)) ||
      (this.props.selectSection.status === 'free' && !nextProps.colorPickerDisplay)||
      (this.props.selectSection.status === 'end' && (nextProps.selectSection.status === 'start' || !nextProps.colorPickerDisplay)) ||
      (this.props.selectSection.status === 'end' && nextProps.colorPickerData!=null && nextProps.colorPickerDisplay)
    );
          /*return (
            this.props.colorPickerDisplay && this.props.activeCommentColor && (this.props.selectSection.status === 'start' && nextProps.selectSection.status === 'end') ||
            (this.props.selectSection.status === 'end' && (nextProps.selectSection.status === 'free' || nextProps.selectSection.status === 'start')) ||

          );*/
      }

    handleSave(){
      const val = (this.refs.popupText as HTMLInputElement).value;
      const previousText = this.props.colorPickerData.PreviousText;
      const start = this.props.colorPickerData.TimeRange.start;
      const end = this.props.colorPickerData.TimeRange.end;
      const id = this.props.colorPickerData._id;
      const timestamp = this.props.colorPickerData.TimeStamp;
      const color = this.props.colorPickerData.Color;
      console.log("ss sending through colorpicker");
      console.log("Start: ",start, "End:", end, "Value:", val, "ID: ", id,"Timestamp", timestamp, color); 
      //props:shouldDisplay=false
      this.props.onCommentSendFilmStripText(id, start, end, val, previousText, "", timestamp, color);
    }

    handleCancel(){
      const text = this.props.colorPickerData.PreviousText;
      const start = this.props.colorPickerData.TimeRange.start;
      const end = this.props.colorPickerData.TimeRange.end;
      const id = this.props.colorPickerData._id;
      const timestamp = this.props.colorPickerData.TimeStamp;
      const color = this.props.colorPickerData.Color;
      const parent = this.props.colorPickerData.Parent;
      console.log("ss sending through colorpicker");
      console.log("HS handleCancel in ColorPicker","Start: ",start, "End:", end, "PreviousText:", text, "ID: ", id,"Timestamp", timestamp, color); 
      this.props.onCommentCancelText(id, start, end, text, parent);
    }

    returnCoordinates(xcoordinate: number){
      const xval = xcoordinate;
      return {
        x: xval,
      }
      
    }

    getBackgroundColor(colour, parent) {
      if(parent){
        switch (colour) {
          case "red":
            return '#ffe6e6';
          case "blue":
            return '#e6f5ff';
          case "green":
            return '#ccffcc';
          case "yellow":
            return '#ffffcc';
          default:
            return '#d9d9d9';
        }
      }else{
        switch (colour) {
          case "red":
            return '#ffcccc';
          case "blue":
            return '#80ccff';
          case "green":
            return '#b3ffb3';
          case "yellow":
            return '#ffff99';
          default:
            return '#f4f4f4';
        }
      }

    }

    render () {
      const xvalue: number = this.props.commentMousePosition.x ? this.props.commentMousePosition.x : this.props.cursorPosition.x;
      const yvalue: number = this.props.commentMousePosition.y ? this.props.commentMousePosition.y : this.props.cursorPosition.y;
      
      if (this.props.selectSection.status === 'end' && this.props.colorPickerDisplay && this.props.activeCommentColor) {

        if(this.props.colorPickerData == null){
          return null;
        }else{
          return (
            <div id={'something'} className={styles.container} style={{ left: xvalue, top: yvalue}}>
              <textarea ref="popupText" style={{backgroundColor:this.getBackgroundColor(this.props.colorPickerData.Color, false),'color':'black'}}>{this.props.colorPickerData.Text}</textarea>
                <IconButton className={styles.icon}
                  iconProps={{ iconName: 'MessageFill' }}
                  onClick={this.handleSave}
              />
                <IconButton className={styles.icon}
                  iconProps={{iconName: 'Cancel'}}
                  onClick={this.handleCancel}/>
            </div>  
          );
        }
      } else if(this.props.selectSection.status === 'free' && this.props.colorPickerDisplay) {
          return (
            <div id={'something'} className={styles.container} style={{ left: xvalue, top: yvalue}}>
              <textarea ref="popupText" style={{backgroundColor:this.getBackgroundColor(this.props.colorPickerData.Color, false),'color':'black'}}>{this.props.colorPickerData.Text}</textarea>
                <IconButton className={styles.icon}
                  iconProps={{ iconName: 'MessageFill' }}
                  onClick={this.handleSave}
              />
                <IconButton className={styles.icon}
                  iconProps={{iconName: 'Cancel'}}
                  onClick={this.handleCancel}/>
            </div>  
          );
      }else{
        return null;
      }
  }
}

const actions = {
  onCommentSendFilmStripText,
  onCommentCancelText,
};

function mapStateToProps (state) {
  return {
    selectSection: state.activeVideo.comment ? state.activeVideo.comment.selectSection : null,
    colorPickerData: state.activeVideo.comment ? state.activeVideo.comment.colorPickerData: null,
    colorPickerDisplay: state.activeVideo.comment ? state.activeVideo.comment.colorPickerDisplay: null,
    commentMousePosition: state.activeVideo.comment ? state.activeVideo.comment.fsComCursorPosition: null,
    filmstripDimensions: state.activeVideo.filmstrip ? state.activeVideo.filmstrip.dimensions : null,
    activeCommentColor: state.activeVideo.comment ? state.activeVideo.comment.activeCommentColor: null,
  };
}

export default connect(mapStateToProps, actions)(ColorPicker);

