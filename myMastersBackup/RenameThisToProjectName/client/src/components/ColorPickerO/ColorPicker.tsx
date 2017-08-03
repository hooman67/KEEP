import React, { CSSProperties, Component } from 'react';
import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import { IColorPicker } from './types';
import * as colors from '../Transcript/components/ColorCSSTypes';
import styles from './styles.css';



class ColorPickerO extends Component<any, any> {
  constructor (props: any) {
    super(props);
  }


  render () {

    return (

      <div className={styles.container} style={{ right: '10px', top: this.props.cursorPosition.y + 35, transition: 'top 1s left 1s'}}>

        <IconButton className={styles.icon}
          iconProps={{ iconName: 'Chat' }}
          onClick={()=>{this.props.clickCommentAdder(true)}} />
      </div>
    );
  }

}


function mapStateToProps (state) {
  return {
    selectSection: state.activeVideo.highlight ? state.activeVideo.highlight.selectSection : null,
  };
}

export default connect(mapStateToProps)(ColorPickerO);
