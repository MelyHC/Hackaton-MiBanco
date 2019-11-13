import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid'; // Tested with v5.0.4, earlier versions MAY NOT HAVE cellRangeSelection
import { db } from '../../Firebase';
import {Link} from 'react-router-dom';
import { Form, Button} from 'react-bootstrap';
import Convenio from './Convenio';
import Teca from './Teca';
import back from '../Css/back.png';


const columns = [
  { key: 'Id', name: 'NRO', width:60 },
  { key: 'MODELO', name: 'MODELO', width:150},
  { key: 'CODIGO_CLIENTE', name: 'CODIGO CLIENTE', width:180},
  { key: 'NOMBRE_CLIENTE', name: 'NOMBRE CLIENTE',width:220},
  { key: 'TIPO_DOC', name: 'TIPO DOC', width:120 },
  { key: 'CODIGO_PRESTAMO', name: 'CODIGO PRESTAMO', width:170 },
  { key: 'DIAS_MORA', name: 'DIAS DE MORA', width:150 },
  { key: 'ESTADO', name: 'ESTADO', width:120},
  { key: 'SALDO_AGENCIA', name: 'SALDO', width:130},
  { key: 'MONEDA', name: 'MONEDA', width:120 },
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

  // handleLogout = (e) => {
  //   e.preventDefault();
  //   logout()
  //     .then(() => {
  //       this.props.history.push("/");
  //     })
  //     .catch((e) => {
  //       alert(e.message);
  //     })
  // }

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
      <div className="view">
        <header className="header">
          <figure className="logo-header"></figure> 
          <h1 className="h1-header">MÓDULO DE CONVENIOS Y TECAS</h1>
        </header>
        <div className="table-padding"> 
         <Form.Label><b>CÓDIGO DEL CLIENTE:</b></Form.Label>
         <Form.Control
              required
              type="text"
              className="imput-cod-cli"
              onChange={ e => this.setState({client: parseInt(e.target.value)})}
          />  
          <Button variant="success"
              onClick={()=>this.handlebtn()}
              type="submit"  
              value="btn"
            ><b>BUSCAR</b>
          </Button>  
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
              <h3>Elije al cliente para registrar el Convenio o Teca!!!</h3>
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
        <Link to ="/"><Button  variant="success"  size="lg" type="submit"  >CERRAR SESIÓN </Button></Link>
        <Link to ="/options"><button variant="success" className="btn-back"><img src={back} alt="ATRÁS"/> </button></Link>
      </div>
    );
  }
}

export default MyDataGrid;