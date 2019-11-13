import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid'; // Tested with v5.0.4, earlier versions MAY NOT HAVE cellRangeSelection
import { db } from '../../Firebase';
import {Link} from 'react-router-dom';
import { Form, Button} from 'react-bootstrap';
import Convenio from './Convenio';
import Teca from './Teca';



const columns = [
  { key: 'Id', name: 'NRO', width:60 },
  { key: 'MODELO', name: 'MODELO', width:130},
  { key: 'CODIGO_CLIENTE', name: 'CODIGO CLIENTE', width:180},
  { key: 'NOMBRE_CLIENTE', name: 'NOMBRE CLIENTE', width:280},
  { key: 'TIPO_DOC', name: 'TIPO DOC', width:120 },
  { key: 'CODIGO_PRESTAMO', name: 'COD PRESTAMO', width:150 },
  { key: 'DIAS_MORA', name: 'DIAS DE MORA', width:140 },
  { key: 'ESTADO', name: 'ESTADO', width:120},
  { key: 'SALDO_AGENCIA', name: 'SALDO', width:120},
  { key: 'MONEDA', name: 'MONEDA', width:110 },
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
        <header className=" button-reg">
          <div>
            <figure className="logo-header"></figure> 
          </div>
          <div> 
            <h3 className="h1-header">MÓDULO DE CONVENIOS Y TECAS</h3>
          </div>
          <div>  <Link className="link-reg" to ="/"><Button variant="outline-success" type="submit" ><b> SALIR</b> </Button></Link>
          </div>
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
        <div className="table-reg">
          <ReactDataGrid
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect
            minColumnWidth={40}
            minHeight={200}
            cellRangeSelection={{
              onComplete: this.setSelection,
            }}
          />
        </div>
        <div className="register">
          {rows.length === 0 &&
              <div>
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
        </div>
      </div>
    );
  }
}

export default MyDataGrid;