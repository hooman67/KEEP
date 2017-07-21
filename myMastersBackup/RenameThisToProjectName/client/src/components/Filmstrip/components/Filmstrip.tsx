import React from 'react';
import ReactCursorPosition from 'react-cursor-position';
import styles from './styles.css';
import FilmstripEventWrapper from './FilmstripEventWrapper';
import {
  IFilmstrip,
} from '../types';

export default (props: IFilmstrip) => {
  return (
    <ReactCursorPosition
      className={styles.container}
      style={{
        height: props.inputData.dimensionsData.generalHeight,
        width: props.inputData.dimensionsData.generalWidth,
      }}
    >
    
      <FilmstripEventWrapper
        inputData={props.inputData}
        actions={props.actions}
      />
    </ReactCursorPosition>
  );
};
