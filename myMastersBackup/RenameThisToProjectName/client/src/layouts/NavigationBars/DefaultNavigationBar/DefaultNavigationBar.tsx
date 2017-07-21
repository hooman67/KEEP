import React, { Component } from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import {
  Persona,
  PersonaSize,
  PersonaPresence,
} from 'office-ui-fabric-react/lib/Persona';
import IDefaultNavigationBar from './types';
import styles from './styles.css';

// TODO: ADD SEARCH CALLBACK
export default class DefaultNavigationBar extends Component<IDefaultNavigationBar, any> {
  render () {
    // TODO: SHOULD COME FROM COMPONENT
    // TODO: ADD USER NAME
    // TODO: UPDATE CSS STYLE
    const examplePersona = {
      imageUrl: './images/persona-female.png',
      imageInitials: 'AL',
      primaryText: 'Annie Lindqvist',
      secondaryText: 'Software Engineer',
      tertiaryText: 'In a meeting',
      optionalText: 'Available at 4:00pm',
    };

    return (
      <div className={styles.navigationBar}>
        <div className={styles.banner}>
          <div className={styles.logo}>
            <img src='https://static2.sharepointonline.com/files/fabric/fabric-website/images/logo-office-dev.svg' width='190' height='48'/>
          </div>
          <div className={styles.userNav}>
            <Label className={styles.userName}>ABC DEF</Label>
            <div className={styles.userHeader}>
              <Persona
                {...examplePersona}
                size={PersonaSize.regular}
                presence={PersonaPresence.none}
                hidePersonaDetails={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
