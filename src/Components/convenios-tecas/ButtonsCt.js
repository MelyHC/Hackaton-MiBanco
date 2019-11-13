import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Convenio from './Convenio';
import Teca from './Teca';

function ControlledTabs() {
  const [key, setKey] = useState('home');

  return (
    <Tabs id="controlled-tab-example" activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="home" title="Teca">
        <Teca />
      </Tab>
      <Tab eventKey="profile" title="Convenio">
        <Convenio />
      </Tab>
    </Tabs>
  );
}
export default ControlledTabs;