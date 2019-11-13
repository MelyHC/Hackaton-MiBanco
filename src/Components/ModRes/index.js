import React, { Component, Fragment } from 'react';
import { logout, db } from '../../Firebase';
import { Form } from 'react-bootstrap';
import { Header } from '../Header';

class ModRes extends Component {
  state = {
    gruopTramo: [],
    tramo: [{
      dayInitial: 31,
      dayEnd: 60
    }, {
      dayInitial: 61,
      dayEnd: 120
    }, {
      dayInitial: 121,
      dayEnd: 720
    }, {
      dayInitial: 721
    }]
  };

  componentWillMount() {
    const { tramo } = this.state;
    const currentTramo = [];
    db.collection("DataBase").get().where("").then((doc) => {
      doc.forEach(obs => {
        currentTramo.push(obs.data());
      })
      // currentTramo.forEach (tramo =>{
      //   const obj = {};
        
      // })
      const data = currentTramo.reduce((result, current) => {
        // result.AGENCIA = result[current.AGENCIA] || []
        // result.MODELO = result[current.MODELO] || [];
        result[current.AGENCIA] = result[current.AGENCIA] || [];

        result[current.AGENCIA].push(current);
        return result;
      },{});
      console.log(data);
      this.setState({ rows: currentTramo });
    }).catch((error) => {
      console.log("ERROR:", error);
    }
    );
  }

  render() {
    const { rows } = this.state;
    return (
      <Fragment>
        <select name="zona" className="form-control m-2">
          <option value="LimaNorte">Lima Norte</option>
          <option value="LimaCentro">Lima Centro</option>
          <option value="LImaSur">Lima Sur</option>
        </select>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Agencia</th>
              <th scope="col">Tramo</th>
              <th scope="col">Clientes</th>
              <th scope="col">Saldo</th>
              <th scope="col">EDR</th>
              <th scope="col">Agencia</th>
              <th scope="col">Tramo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>

      </Fragment>

    );
  }
}

export default ModRes;

