import React, { Component } from 'react';
import { logout, db } from '../../Firebase';
import Popup from "reactjs-popup";
import {Link} from 'react-router-dom';
import { Button} from 'react-bootstrap';


class ModRes extends Component {
  state = {
    group: [],
    topLeft: {},
    botRight: {},
    filter: '',
    filterGroup: [],
    clients: [],
    agent: []
  };

  componentDidMount() {
    const currentGroup = [];
    const agent = [];
    db.collection("Comotuquieras").get().then((doc) => {
      doc.forEach(obs => {
        obs.data().ID = obs.id;
        currentGroup.push(obs.data());

        if (!agent.find(({ name }) => name === obs.data().AGENCIA)) {

          agent.push({ name: obs.data().AGENCIA })
        }
      })
      this.setState({ group: currentGroup, filterGroup: currentGroup, agent });
    }).catch((error) => {
      console.log("ERROR:", error);
    }
    );
  }

  selectAgent = (agencia, filter) => {
    const currentRows = [];

    db.collection("DataBase").where("AGENCIA", "==", agencia).where("MODELO", "==", filter).get()
      .then((doc) => {
        doc.forEach(obs => {
          obs.data().ID = obs.id;
          console.log(obs.data().ID,  obs.id)
          currentRows.push(obs.data());
        })
        this.setState({ clients: currentRows });
      }).catch((error) => {
        console.log("ERROR:", error);
      });
  }

  handleLogout = (e) => {
    e.preventDefault();
    logout()
      .then(() => {
        this.props.history.push("/");
      })
      .catch((e) => {
        alert(e.message);
      })
  }

  setSelection = (args) => {
    this.setState({
      topLeft: {
        rowIdx: args.topLeft.rowIdx,
        colIdx: args.topLeft.idx,
      },
      botRight: {
        rowIdx: args.bottomRight.rowIdx,
        colIdx: args.bottomRight.idx,
      },
    });
  };

  filterData = (e) => {
    const { group } = this.state;
    const currentFilter = e.target.value;
    const newArrFilter = currentFilter === 'Todos' ? group : group.filter(({ MODELO }) => MODELO === currentFilter)

    this.setState({ filterGroup: newArrFilter })
  }

  updateAsig = () => {
    const { clients } = this.state;
    clients.forEach(client  => {
      console.log(client)
      db.collection("DataBase").doc(client.ID).update({
        client
      })
        .then(() => {
          alert('Se agrego correctamente')
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    })
  }

  updateStateAsig = (e, id) => {
    const { clients } = this.state;
    const newArrClients = clients.map(client => {
      if (client.ID === id) {
        client[e.target.name] = e.target.value
      }
      return client
    })
    this.setState({ clients: newArrClients });
  }

  handlePopUp = () => {
      this.props.history.push("/options");
      this.updateAsig(); 
  }

  render() {
    const { filterGroup, clients, agent } = this.state;

    return (
      <div className="mod-res">
                              <header className=" button-reg">
            <div>
              <figure className="logo-header"></figure> 
            </div>
            <div> 
              <h3 className="h1-header">ASIGNACIÓN DE EJECUTIVOS</h3>
            </div>
            <div>  <Link className="link-reg" to ="/"><Button variant="outline-success" type="submit" ><b> SALIR</b> </Button></Link>
            </div>
          </header>
          
        {/* <header className="d-flex justify-content-between align-items-center border">
          <figure className="logo-header"></figure> 
          <h1 className="">ASIGNACIÓN DE EJECUTIVOS</h1>
          <button className="btn" onClick={this.handleLogout}>Salir</button>
        </header> */}
        <div className="d-flex p-4 ">
        <select name="zona" className="form-control m-2 w-auto">
          <option value="LimaNorte">Lima Norte</option>
          <option value="LimaCentro">Lima Centro</option>
          <option value="LImaSur">Lima Sur</option>
        </select>
        <select name="Modelo" className="form-control m-2 w-auto" onChange={(e) => this.filterData(e)}>
          <option disable="true" selected hidden>Modulo</option>
          <option value="Todos">Todos</option>
          <option value="Recuperación">Recuperación</option>
          <option value="Inhibición">Inhibición</option>
          <option value="Multitramo">Multitramo</option>
          <option value="Resolución">Resolución</option>
        </select>
        </div>
        <div className="row m-0 p-0">
          <div className="scroll col-md-6">
            <table className="table table-hover w-100">
              <thead>
                <tr>
                  <th scope="col">Agencia</th>
                  <th scope="col">Clientes</th>
                  <th scope="col">Saldo</th>
                </tr>
              </thead>
              <tbody className="">
                {
                  filterGroup.length !== 0 ? filterGroup.map(({ SALDO, AGENCIA, MODELO, CLIENTES }, key) =>
                    <tr key={key} onClick={() => this.selectAgent(AGENCIA, MODELO)}>
                      <th>{AGENCIA}</th>
                      <td>{CLIENTES}</td>
                      <td>{SALDO}</td>
                    </tr>) :
                    <tr>Cargando ...</tr>
                }</tbody>
            </table>
          </div>
          <div className="col-md-6">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">EDR</th>
                  <th scope="col">Agencia</th>
                  <th scope="col">Tramo</th>
                </tr>
              </thead>
              <tbody>
                {clients.length !== 0 ? clients.map(({ EDR_ASIGNADO, ID }) =>
                  <tr>
                    <td>{EDR_ASIGNADO}</td>
                    <td><select name="AGENCIA" className="form-control m-2" onChange={(e) => this.updateStateAsig(e,ID)} >
                      <option disable="true" selected hidden>Agencia</option>
                      {agent.map(({ name }) => <option value={name}>{name}</option>)}
                    </select></td>
                    <td><select name="MODELO" className="form-control m-2" onChange={(e) => this.updateStateAsig(e, ID)}>
                      <option disable="true" selected hidden>Tramo</option>
                      <option value="Recuperación">Recuperación</option>
                      <option value="Inhibición">Inhibición</option>
                      <option value="Multitramo">Multitramo</option>
                      <option value="Resolución">Resolución</option>
                    </select></td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-center">
        <Popup className="popup" trigger={<button className="btn btn-success rounded-pill m-3 px-4">Guardar</button>} position="rigth">
    <div>CAMBIOS REALIZADO EXITOSAMENTE</div>
    <button onClick={this.handlePopUp}>ACEPTAR</button>
  </Popup>
        
        <button className="btn m-3 px-4">Volver</button>
        </div>
      </div>
    );
  }
}

export default ModRes;
