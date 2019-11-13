import React, { useState } from 'react';
import Filter from './Filter';
import Table from './Table';
import ControlledTabs from './ButtonsCt';


const ViewRegister = () => {
  const [client, setClient] = useState("");
    
  return (
    <div>
      {/* <Header/> */}
      <div>
        <Filter client={client} setclient={setClient} />
        <Table />
        <ControlledTabs />;
      </div>
    </div>
  )
}
export default ViewRegister;