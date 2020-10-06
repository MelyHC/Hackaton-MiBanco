import React, { Component } from 'react';
import { range } from 'lodash';
import ReactDataGrid from 'react-data-grid'; // Tested with v5.0.4, earlier versions MAY NOT HAVE cellRangeSelection
import { logout, db } from '../../Firebase';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';




const columns = [
  { key: 'CODIGO_CLIENTE', name: 'CODIGO CLIENTE', editable: true , width:170},
  { key: 'EDR_ANTERIOR', name: 'EDR ANTERIOR', width:150 },
  { key: 'EDR_ASIGNADO', name: 'EDR ASIGNADO' , width:150},
  { key: 'HERRAMIENTA', name: 'HERRAMIENTA', width:150 },
  { key: 'EDR_SUPER', name: 'EDR SUPER', editable: true, width:150 },
  { key: 'JUSTIFICACION', name: 'JUSTIFICACION', editable: true },
];


const defaultParsePaste = str => (
  str.split(/\r\n|\n|\r/)
    .map(row => row.split('\t'))
);

let row0 = {
  "CODIGO_CLIENTE": null,
  "TIPO_DOC": "",
  "NRO_DOC": null,
  "NOMBRE_CLIENTE": "",
  "MONTO_PRESTAMO": null,
  "CODIGO_PRESTAMO": null,
  "DIAS_MORA": null,
  "MONEDA": "",
  "CANT_CLIEN": null,
  "AGENCIA": "",
  "ZONA": "",
  "TERRITORIAL": "",
  "SUPERVISOR": "",
  "EJECUTIVO": "",
  "HERRAMIENTA": "",
  "ESTADO": "",
  "EDR_ANTERIOR": "",
  "EDR ASIGNADO": "",
  "EDR SUPER": "",
  "MONTO_CUOTA": null,
  "NRO CUOTA": null,
  "FECH_INIC": "",
  "FECH_VENCI": "",
  "MODELO": "",
  "SALDO_AGENCIA": null,
  "JUSTIFICACION": ""
}

class MyDataGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      topLeft: {},
      botRight: {},
    };

    // Copy paste event handler
    document.addEventListener('copy', this.handleCopy);
    document.addEventListener('paste', this.handlePaste);
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

  handleSave = (e) => {
    e.preventDefault()
    const stateArray = this.state.rows;
    stateArray.forEach(elem =>
      db.collection("DataBase").doc(elem.Id).update(elem)
      )
    this.setState({
      rows:[row0],
    })
  }

  componentWillUnmount() {
    this.removeAllListeners();
  }

  removeAllListeners = () => {
    document.removeEventListener('copy', this.handleCopy);
    document.removeEventListener('paste', this.handlePaste);
  }

  rowGetter = (i) => {
    const { rows } = this.state;
    return rows[i]
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

  handleCopy = (e) => {
    console.debug('handleCopy Called');
    e.preventDefault();
    const { topLeft, botRight } = this.state;

    // Loop through each row
    const text = range(topLeft.rowIdx, botRight.rowIdx + 1).map(
      // Loop through each column
      rowIdx => columns.slice(topLeft.colIdx, botRight.colIdx + 1).map(
        // Grab the row values and make a text string
        col => this.rowGetter(rowIdx)[col.key],
      ).join('\t'),
    ).join('\n');
    console.debug('text', text);
    e.clipboardData.setData('text/plain', text);
  }

  handlePaste = (e) => {
    console.debug('handlePaste Called');
    e.preventDefault();
    const { topLeft } = this.state;

    const newRows = [];
    const pasteData = defaultParsePaste(e.clipboardData.getData('text/plain'));

    console.debug('pasteData', pasteData);

    pasteData.forEach((row) => {
      const rowData = {};
      // Merge the values from pasting and the keys from the columns
      columns.slice(topLeft.colIdx, topLeft.colIdx + row.length)
        .forEach((col, j) => {
          // Create the key-value pair for the row
          rowData[col.key] = row[j];
        });
      // Push the new row to the changes
      newRows.push(rowData);
    });

    console.debug('newRows', newRows);

    this.updateRows(topLeft.rowIdx, newRows);
  }

  getFirebaseData = (client) => {
    let currentRows= this.state.rows;
    db.collection("DataBase").where("CODIGO_CLIENTE", '==', client).get().then((doc) => {
      doc.forEach(obs => {
        const dataObj = obs.data();
        dataObj.Id=obs.id
        
        currentRows.push(dataObj)
      }
      )
      this.setState({ rows: currentRows });
    }).catch((error) => {
      console.log("ERROR:", error);
    }
    );
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated, action }) => {
    console.debug('onGridRowsUpdated!', action);
    console.debug('updated', updated);
    if (updated.CODIGO_CLIENTE) {

      this.getFirebaseData(parseInt(updated.CODIGO_CLIENTE))

    }

    if (action !== 'COPY_PASTE') {
      this.setState((state) => {
        const rows = state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
          rows[i] = { ...rows[i], ...updated };
        }
        
        
        return { rows };
      });
    }
  };

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
    const newRows = rows.concat(row0);
    return (
      <div className="cont-obs-asig-mod">
                    <header className=" button-reg">
            <div>
              <figure className="logo-header"></figure> 
            </div>
            <div> 
              <h3 className="h1-header">OBSERVACIONES DE ASIGNACIÓN</h3>
            </div>
            <div>  <Link className="link-reg" to ="/"><Button variant="outline-success" type="submit" ><b> SALIR</b> </Button></Link>
            </div>
          </header>
      <div className="table">
      <ReactDataGrid
          columns={columns}
          rowGetter={i => newRows[i]}
          rowsCount={newRows.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect
          minColumnWidth={40}
          minHeight={50}
          cellRangeSelection={{
            onComplete: this.setSelection,
          }}
        />
      </div>
          <div>

         <Button variant="outline-success"
                    size="lg"
                    onClick={this.handleSave}
                    type="submit"  
                    >Guardar</Button>
      
          </div>
      </div>

    );
  }
}

export default MyDataGrid;