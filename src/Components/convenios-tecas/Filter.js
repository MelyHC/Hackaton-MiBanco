import React from 'react';
import {Button} from 'react-bootstrap';

const Filter = ({ client, setclient }) => {
  const handlebtn = (e) =>{
    e.preventDefault();
    setclient('');
    console.log(client);
  }
  return (
    <div>
      <label >CÓDIGO DEL CLIENTE:
        <input type="number"  value={client} onChange={(e) => { setclient(e.target.value) }} />
      </label>
      <Button variant="success"
        onClick={handlebtn}
        type="submit"  
        value="btn"
        >BUSCAR</Button>
    </div>
  )
}
export default Filter;