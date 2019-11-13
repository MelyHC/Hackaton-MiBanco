import React, { Component, Fragment } from 'react';
import { logout, db } from '../../Firebase';
import { Header } from '../Header';

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
        obs.ID = obs.id;
        currentGroup.push(obs.data());

        if (agent.find(({ name }) => name !== obs.data().AGENCIA)) {
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

    db.collection("Comotuquieras").where("AGENCIA", "==", agencia).where("MODELO", "==", filter).get()
      .then((doc) => {
        doc.forEach(obs => {
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
  updateRow = () => { }

  filterData = (e) => {
    const { group } = this.state;
    const currentFilter = e.target.value;
    const newArrFilter = currentFilter === 'Todos' ? group : group.filter(({ MODELO }) => MODELO === currentFilter)
    console.log(newArrFilter)
    this.setState({ filterGroup: newArrFilter })
  }

  render() {
    const { filterGroup, clients } = this.state;

    return (
      <Fragment>
        <select name="zona" className="form-control m-2">
          <option value="LimaNorte">Lima Norte</option>
          <option value="LimaCentro">Lima Centro</option>
          <option value="LImaSur">Lima Sur</option>
        </select>
        <select name="Modelo" className="form-control m-2" onChange={(e) => this.filterData(e)}>
          <option disable="true" selected hidden>Modulo</option>
          <option value="Todos">Todos</option>
          <option value="Recuperación">Recuperación</option>
          <option value="Inhibición">Inhibición</option>
          <option value="Multitramo">Multitramo</option>
          <option value="Resolución">Resolución</option>
        </select>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Agencia</th>
              <th scope="col">Clientes</th>
              <th scope="col">Saldo</th>
              <th scope="col">EDR</th>
              <th scope="col">Agencia</th>
              <th scope="col">Tramo</th>
            </tr>
          </thead>
          <tbody>
            {
              filterGroup.length !== 0 ? filterGroup.map(({ SALDO, AGENCIA, MODELO, CLIENTES }, key) =>
                <tr key={key} onClick={() => this.selectAgent(AGENCIA, MODELO)}>
                  <th>{AGENCIA}</th>
                  <td>{CLIENTES}</td>
                  <td>{SALDO}</td>
                  {clients.length !== 0 ? clients.map(({ EJECUTIVO }) =>
                    <div>
                      <th>{EJECUTIVO}</th>
                      <td>{MODELO}</td>
                      <td>{CLIENTES}</td>
                      <td>{SALDO}</td>
                    </div>) : null}
                </tr>) :
                <tr>Cargando ...</tr>
            }

          </tbody>
        </table>
        <button onClick={this.handleLogout}>Salir</button>
      </Fragment>
    );
  }
}

export default ModRes;
