import React, { Component } from 'react';
import _ from 'lodash';
import Thumbnail from './Thumbnail';
import {
    IThumbnailPlayer,
    IThumbnailData,
    ISingleThumbnailData
} from '../types/IThumbnail';

import {thumbnail} from './ThumbnailData';
import ReactCursorPosition from 'react-cursor-position';
import Measure from 'react-measure';
import {ICursorPosition} from '../../../types';
export default class ThumbnailPlayer extends Component<IThumbnailPlayer, any>{
    constructor(props: IThumbnailPlayer){
        super(props);
        this.state = {
            activeImageSrc: null,
        }
        this.imageFromArray = this.imageFromArray.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
           activeImageSrc: this.imageFromArray(nextProps), 
        });
    }

    imageFromArray(nextProps){
        //record the cursorPosition
        let index=0;

        const multiplier = 200/nextProps.data.length;

        for(let i=0; i< multiplier; i++){
            if(nextProps.cursorPosition.x > i*multiplier && nextProps.cursorPosition.x <= (i+1)*multiplier ){
                index=i;
            }
        }

        return this.props.data[index];

    }
    
    render(){

        const thumbnailData = thumbnail;

        return(
            <div
            style={{
            height: 150,
            width: 200,
        }}
      >
            <Thumbnail
                  key={0}
                  dimensions={{
                   height: 150,
                   width: 200,
                  }}
                  data={this.imageFromArray(this.props)}
                  src={thumbnailData.src}
            />



      </div>
        );
    }
}