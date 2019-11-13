import React, { Component } from 'react';
import { range } from 'lodash';
import ReactDataGrid from 'react-data-grid'; // Tested with v5.0.4, earlier versions MAY NOT HAVE cellRangeSelection
import { logout, db } from '../../Firebase';

const columns = [
  { key: 'COD_CLI', name: 'COD_CLI', editable: true },
  { key: 'FEC_REG', name: 'FEC_REG', editable: true },
  { key: 'FEC_ULT_MOD', name: 'FEC_ULT_MOD', editable: true },
  { key: 'PERIODO', name: 'PERIODO', editable: true },
  { key: 'SUPERVISOR', name: 'SUPERVISOR', editable: true },
  { key: 'SUSTENTO', name: 'SUSTENTO', editable: true },
  { key: 'USU_FIN', name: 'USU_FIN', editable: true },
  { key: 'USU_NT_MOD', name: 'USU_NT_MOD', editable: true },
  { key: 'USU_NT_REG', name: 'USU_NT_REG', editable: true },
];

// const initialRows = Array.from(Array(1000).keys(), (_, x) => (
//   { id: x, title: x * 2, count: x * 3, sarah: x * 4, jessica: x * 5 }
// ));

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
    };

    // Copy paste event handler
    document.addEventListener('copy', this.handleCopy);
    document.addEventListener('paste', this.handlePaste);
  }

  componentWillMount() {
    db.collection("ObsAsig").get().then((doc) => {
      doc.forEach(obs => {
    for (const key in obs.data()) {
        if (obs.data().hasOwnProperty(key)) {
        const element = obs.data()[key];
        console.log(key, element)
        }
    }                                     
      }
      )
    }).catch((error) => {
      console.log("ERROR:", error);
    }
    );
  }


  handleLogout = (e) => {
    e.preventDefault();
      logout()
      .then(()=>{
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
      console.log(this.state);
      
    const { rows } = this.state;
    return (
      <div>
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
        <button onClick={this.handleLogout}>Salir</button>
      </div>

    );
  }
}

export default MyDataGrid;
