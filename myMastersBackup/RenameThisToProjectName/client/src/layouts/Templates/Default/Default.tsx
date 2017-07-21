import React from 'react';
import styles from './styles.css';
import IDefaultTemplate from './types';

// TODO: COMMANDBAR PASSED FROM PARENT COMPONENT
// TODO: SIDEBAR PASSED FROM PARENT COMPONENT
const items = [
  {
    key: 'add',
    name: 'Add Course',
    icon: 'Add',
  },
];

const DefaultTemplate = (props: IDefaultTemplate) => (
  <div className={styles.app}>
    {props.header}
    {props.commandbar}
    <div className={styles.body}>
      <div className={styles.sidebar}>
        {props.sidebar}
      </div>
      <div className={styles.content}>
        {props.content}
      </div>
    </div>
  </div>
);

export default DefaultTemplate;
