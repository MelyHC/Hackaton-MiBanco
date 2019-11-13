import React, { Component } from 'react';
import { range } from 'lodash';
import ReactDataGrid from 'react-data-grid'; // Tested with v5.0.4, earlier versions MAY NOT HAVE cellRangeSelection
import { logout, db } from '../../Firebase';


const columns = [
  { key: 'CODIGO_CLIENTE', name: 'CODIGO_CLIENTE', editable: true },
  { key: 'EDR_ANTERIOR', name: 'EDR_ANTERIOR' },
  { key: 'EDR_ASIGNADO', name: 'EDR_ASIGNADO' },
  { key: 'HERRAMIENTA', name: 'HERRAMIENTA' },
  { key: 'EDR_SUPER', name: 'EDR_SUPER', editable: true },
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
      rows: [row0],
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
  // componentWillMount() {
  //   const currentRows = [];
  //   db.collection("DataBase").get().then((doc) => {
  //     doc.forEach(obs => {
  //       currentRows.push(obs.data());
  //       console.log(obs.data());

  //     }
  //     )
  //     this.setState({ rows: currentRows });
  //   }).catch((error) => {
  //     console.log("ERROR:", error);
  //   }
  //   );
  // }
  getFirebaseData = (client) => {
    let currentRows= [];
    db.collection("DataBase").where("CODIGO_CLIENTE", '==', client).get().then((doc) => {
      doc.forEach(obs => {
        currentRows.push(obs.data())
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
    return (
      <div>
        <ReactDataGrid
          columns={columns}
          rowGetter={i => rows[i]
          }
          rowsCount={rows.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect
          minColumnWidth={40}
          cellRangeSelection={{
            onComplete: this.setSelection,
          }}
        />
        <button onClick={this.handleLogout}>Salir</button>
      </div>

    );
  }
}

export default MyDataGrid;