import React, { Component } from 'react';
import { range } from 'lodash';
import ReactDataGrid from 'react-data-grid'; // Tested with v5.0.4, earlier versions MAY NOT HAVE cellRangeSelection
import { logout, db } from '../../Firebase';
import { Form, Col, Button} from 'react-bootstrap';
import Convenio from './Convenio';
import Teca from './Teca';


const columns = [
  { key: 'id', name: 'NRO', editable: true },
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

const defaultParsePaste = str => (
  str.split(/\r\n|\n|\r/)
    .map(row => row.split('\t'))
);

class MyDataGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      topLeft: {},
      botRight: {},
      client:'',
    };
 
    // Copy paste event handler
    document.addEventListener('copy', this.handleCopy);
    document.addEventListener('paste', this.handlePaste);
  }

  handlebtn =()=> {
    const currentRows = [];
    const {client} = this.state;
    db.collection("DataBase").where('CODIGO_CLIENTE','==', client).get().then((doc) => {
      doc.forEach(obs => {
        currentRows.push(obs.data());
       console.log(obs.data());
      })
      this.setState({ rows: currentRows });
    }).catch((error) => {
      console.log("ERROR:", error);
    }
    );
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

  onGridRowsUpdated = ({ fromRow, toRow, updated, action }) => {
    console.debug('onGridRowsUpdated!', action);
    console.debug('updated', updated);
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
        <Convenio/>
        <Teca/>
        <button onClick={this.handleLogout}>Salir</button>
      </div>

    );
  }
}

export default MyDataGrid;