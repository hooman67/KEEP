import React from 'react';
import { Nav } from 'office-ui-fabric-react/lib/Nav';

const DefaultSideBar = (props) => (
  <div className='SidebarMenu'>
    <Nav
      groups={props.groups}
      expandedStateText={props.expanded}
      collapsedStateText={props.collapsed}
    />
  </div>
);

export default DefaultSideBar;
