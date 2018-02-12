'use strict';

const agGrid = require('ag-grid');
const path = require('path');
const url = require('url');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;

const types = ["INT", "STRING"];

const datalistId = 'data-types';
const datalist = document.createElement('datalist');
datalist.setAttribute('id', datalistId);
types.forEach(type => {
  const option = document.createElement('option');
  option.setAttribute('value', type);
  datalist.appendChild(option);
});
document.getElementsByTagName('body')[0].appendChild(datalist);

class CountryDropDown {
  init() {    
    this.elem = document.createElement('input');
    this.elem.setAttribute('list', datalistId);
    this.elem.classList.add('type-input');
  }
  getGui() {
    return this.elem;
  }
  afterGuiAttached() {
    this.elem.focus();
  }
  getValue() {
    this.elem.value;
  }
  destroy() {}
  isPopup() {
    return false;
  }
}

class CellCheckBox {
  init(params) {
    const val = params.getValue && params.getValue();

    this.elem = document.createElement('input');
    this.elem.setAttribute('type', 'checkbox');
    //make it unchangeable
    this.elem.addEventListener('click', function() {
      this.checked == true ? this.checked = false : this.checked = true;
    });
    this.elem.classList.add('column-checkbox');

    if (val) {
      this.elem.checked = true;
    }
  }
  getGui() {
    return this.elem;
  }
  afterGuiAttached() {
    this.elem.focus();
  }
  getValue() {
    this.elem.value;
  }
  destroy() {}
  isPopup() {
    return false;
  }
}

class CellDelete {
  init() {
    this.elem = document.createElement('img');
    this.elem.setAttribute('');
  }
}

const gridOptions = {
  components:{
    countryDropdown: CountryDropDown,
    cellCheckBox: CellCheckBox
  },
  rowSelection: 'single',
  onSelectionChanged(api) {
    const selectedRow = api.api.getSelectedRows()[0];
    if (selectedRow) {
      let createTableWindow = BrowserWindow.getFocusedWindow();
      let editRowWindow = new BrowserWindow({
        width: 405,
        height: 340,
        parent: createTableWindow,
        resizable: false
      });

      editRowWindow.webContents.openDevTools();

      editRowWindow.setMenu(null);      

      editRowWindow.on('closed', function () {
        editRowWindow = null;
        api.api.deselectAll();        
      });

      editRowWindow.on('show', function () {
        editRowWindow.webContents.send('row-data', selectedRow);
      });

      editRowWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../editRow/editRow.html'),
        protocol: 'file:',
        slashes: true
      }));
    }    
  },
  columnDefs: [
    {
      headerName: '',      
      width: 50
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 150
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 100
    },
    {
      headerName: 'Primary key',
      field: 'primaryKey',
      width: 120,
      cellRenderer: CellCheckBox
    },
    {
      headerName: 'Not Null',
      field: 'notNull',      
      width: 100,
      cellRenderer: CellCheckBox
    },
    {
      headerName: 'Unique',
      field: 'unique',
      width: 100,
      cellRenderer: CellCheckBox
    },
    {
      headerName: 'Auto Increment',
      field: 'autoIncrement',
      width: 140,
      cellRenderer: CellCheckBox
    }
  ],
  rowData: [
    {      
      newRowPlaceholder: true,
      name: 'click to edit',
      primaryKey: true
    }
  ]
}

const grid = document.getElementById('column-des-grid');

new agGrid.Grid(grid, gridOptions);