import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid'; // Tested with v5.0.4, earlier versions MAY NOT HAVE cellRangeSelection
import { logout, db } from '../../Firebase';
import { Form, Col, Button} from 'react-bootstrap';
import Convenio from './Convenio';
import Teca from './Teca';
import back from '../Css/back.png';

const columns = [
  { key: 'Id', name: 'NRO', editable: true },
  { key: 'MODELO', name: 'MODELO', editable: true },
  { key: 'CODIGO_CLIENTE', name: 'CODIGO CLIENTE', editable: true },
  { key: 'NOMBRE_CLIENTE', name: 'NOMBRE CLIENTE', editable: true },
  { key: 'TIPO_DOC', name: 'TIPO DOCUMENTO', editable: true },
  { key: 'CODIGO_PRESTAMO', name: 'CODIGO PRESTAMO', editable: true },
  { key: 'DIAS_MORA', name: 'DIAS DE MORA', editable: true },
  { key: 'ESTADO', name: 'ESTADO', editable: true },
  { key: 'SALDO_AGENCIA', name: 'SALDO', editable: true },
  { key: 'MONEDA', name: 'MONEDA', editable: true },
];

class MyDataGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      topLeft: {},
      botRight: {},
      client:'',
    };

  }

  handlebtn =()=> {
    const currentRows = [];
    const {client} = this.state;
    db.collection("DataBase").where('CODIGO_CLIENTE','==', client).get().then((doc) => {
      doc.forEach(obs => {
      //   currentRows.push(obs.data());
      //  console.log(obs.data());
      const dataObj = obs.data();
      dataObj.Id=obs.id
      currentRows.push(dataObj)
      console.log(dataObj);
      console.log(currentRows);
      })
      this.setState({ rows: currentRows });

    }).catch((error) => {
      console.log("ERROR:", error);
    }
    );
  }
    
  handleSave = (e) => {
    e.preventDefault()
    const stateArray = this.state.rows;
    stateArray.forEach(elem =>
      db.collection("DataBase").doc(elem.Id).update(elem)
      )
      console.log(stateArray);
    this.setState({
      rows:[],
   
    })
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

  rowGetter = (i) => {
    const { rows } = this.state;
    return rows[i];
  }

  updateRows = (startIdx, newRows) => {
    this.setState((state) => {
      const rows = state.rows.slice();
      for (let i = 0; i < newRows.length; i++) {
        if (startIdx + i < rows.length) {
          rows[startIdx + i] = { ...rows[startIdx + i], ...newRows[i] };
        }
      }
      return { rows };
    });
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

  render() {
    const { rows } = this.state;
    return (
      <div>
         <div>
            <Form.Group as={Col} md="3" controlId="validationCustom">
              <Form.Label>CÓDIGO DEL CLIENTE:
                <Form.Control
                  required
                  type="text"
                  className="imput-cod-cli"
                  onChange={ e => this.setState({client: parseInt(e.target.value)})}
                />  
              </Form.Label>
                <Button variant="success"
                  onClick={()=>this.handlebtn()}
                  type="submit"  
                  value="btn"
                >BUSCAR</Button>
              </Form.Group>
          </div>
        <ReactDataGrid
          columns={columns}
          rowGetter={i => rows[i]}
          rowsCount={rows.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect
          minColumnWidth={40}
          cellRangeSelection={{
            onComplete: this.setSelection,
          }}
        />
        {rows.length === 0 &&
            <div className="mt-5 w-100 text-align">
            Elije al cliente para registrar el Convenio o Teca!!!
            </div>}
          {rows.length !== 0 &&
            rows.map(el => {
              if (el.ESTADO === 'C') {
                return <Convenio data={el} key={el.Id} handleSave={this.handleSave} />
              } else if (el.ESTADO === 'A') {
                return <Teca data={el} key={el.Id} handleSave={this.handleSave}/>
              }
            })
          }
        <button onClick={this.handleLogout}>CERRAR SESION </button>
        <button onClick={this.handleLogout}><img src={back} alt="ATRÁS"/> </button>
      </div>
    );
  }
}

export default MyDataGrid;