import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import SideBar from './SideBar';
import SideBarComment from './SideBarComment';


class SideBarOverlay extends Component<any, any> {

  render () {

return (
  <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
    <Tab eventKey={1} title="Highlights"><SideBar /></Tab>
    <Tab eventKey={2} title="Comments"><SideBarComment /></Tab>
    <Tab eventKey={3} title="Annotations">There are no annotations added!</Tab>
  </Tabs>
);
}

}



export default SideBarOverlay
