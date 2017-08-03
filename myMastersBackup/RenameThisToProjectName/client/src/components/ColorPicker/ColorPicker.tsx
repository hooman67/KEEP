import React, {CSSProperties, Component} from 'react';
import {connect} from 'react-redux';
import {GithubPicker} from 'react-color';
import styles from './styles.css';
import { IColorPicker} from './types';
import { DefaultButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import {
    onCommentSendFilmStripText,
    cancelCommentEditFilmstrip
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

    }
    
    shouldComponentUpdate (nextProps: IColorPicker) {
    return ((this.props.selectSection.status === 'start' && nextProps.selectSection.status === 'end') || 
    (this.props.selectSection.status === 'start' && nextProps.selectSection.status ==='free' && this.props.colorPickerDisplay && (this.props.colorPickerData!=null)) ||
    (this.props.selectSection.status === 'free' && !nextProps.colorPickerDisplay)||
    (this.props.selectSection.status === 'end' && (nextProps.selectSection.status === 'start' || !nextProps.colorPickerDisplay)));
        //  return (this.props.colorPickerDisplay && this.props.activeCommentColor && (this.props.selectSection.status === 'start' && nextProps.selectSection.status === 'end') ||  (this.props.selectSection.status === 'end' && (nextProps.selectSection.status === 'free' || nextProps.selectSection.status === 'start')));
      }

    handleSave(){
      const val = (this.refs.popupText as HTMLInputElement).value;
      const start = this.props.colorPickerData.TimeRange.start;
      const end = this.props.colorPickerData.TimeRange.end;
      const id = this.props.colorPickerData._id;
      const timestamp = this.props.colorPickerData.TimeStamp;
      const color = this.props.colorPickerData.Color;
      console.log("ss sending through colorpicker");
      console.log("Start: ",start, "End:", end, "Value:", val, "ID: ", id,"Timestamp", timestamp, color); 
      //props:shouldDisplay=false
      this.props.onCommentSendFilmStripText(id, start, end, val, "", timestamp, color);
    }

    handleCancel(){
      this.props.cancelCommentEditFilmstrip();
    }

    returnCoordinates(xcoordinate: number){
      const xval = xcoordinate;
      return {
        x: xval,
      }
      
    }

    render () {
        const xvalue: number = this.props.cursorPosition.x;
        const yvalue: number = this.props.cursorPosition.y;
      if (this.props.selectSection.status === 'end' && this.props.colorPickerDisplay && this.props.activeCommentColor) {

        if(this.props.colorPickerData == null){
          return null;
        }else{
          return (
            <div id={'something'} className={styles.container} style={{ left: xvalue, top: yvalue}}>
              <textarea ref="popupText">{this.props.colorPickerData.Text}</textarea>
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
              <textarea ref="popupText">{this.props.colorPickerData.Text}</textarea>
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
  cancelCommentEditFilmstrip
};

function mapStateToProps (state) {
  return {
    selectSection: state.activeVideo.comment ? state.activeVideo.comment.selectSection : null,
    colorPickerData: state.activeVideo.comment ? state.activeVideo.comment.colorPickerData: null,
    colorPickerDisplay: state.activeVideo.comment ? state.activeVideo.comment.colorPickerDisplay: null,
    filmstripDimensions: state.activeVideo.filmstrip ? state.activeVideo.filmstrip.dimensions : null,
    activeCommentColor: state.activeVideo.comment ? state.activeVideo.comment.activeCommentColor: null,
  };
}

export default connect(mapStateToProps, actions)(ColorPicker);

