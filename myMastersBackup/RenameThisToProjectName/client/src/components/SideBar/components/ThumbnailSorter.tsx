import React, { Component } from 'react';
import _ from 'lodash';
import Thumbnail from './Thumbnail';
import ThumbnailPlayer from './ThumbnailPlayer';
import {
    IThumbnailPlayer,
    IThumbnailData,
    ISingleThumbnailData, 
    IThumbnailSorter
} from '../types/IThumbnail';

import {thumbnail} from './ThumbnailData';
import ReactCursorPosition from 'react-cursor-position';
import Measure from 'react-measure';
import {ICursorPosition} from '../../../types';

export default class ThumbnailSorter extends Component<any, any>{
    constructor(props: IThumbnailSorter){
        super(props);
        this.calculateIndex = this.calculateIndex.bind(this);
    }


    calculateIndex (searchElement: number): ISingleThumbnailData {
        const thumbnailData: IThumbnailData = thumbnail;
        return thumbnailData.coordinates[Math.floor((searchElement / thumbnailData.duration) * thumbnailData.coordinates.length)];
    }

    
    render(){
        const thumbnailData = thumbnail;
        const duration = thumbnailData.duration;
        const thumbnailLength = thumbnailData.coordinates.length;
        const multiplier = duration/thumbnailLength;

        const start = this.props.start;
        const end = this.props.end;

        const interval = end - start;
        const offset = interval/thumbnailLength;

        const thumbnailList: ISingleThumbnailData[] = []; 
        let i=0;

        for(i=start; i<end; i=i+multiplier){
           const value = this.calculateIndex(i);
           thumbnailList.push(value); 
        }

        const cursorPosition: ICursorPosition = this.props.cursorPosition;

        return(
            <div
            style={{
            height: 150,
            width: 200,
        }}
      >
      <ReactCursorPosition>
            <ThumbnailPlayer
                  key={0}
                  start={start}
                  end={end}
                  cursorPosition={cursorPosition}
                  data={thumbnailList}
            />
      </ReactCursorPosition>
      </div>
        );
    }
}