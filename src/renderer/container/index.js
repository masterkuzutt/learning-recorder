
import React from 'react';
import ReactDOM from 'react-dom';
import Component from '../components/Component.js';
// const {remote} = require('electron')
import {remote} from 'electron';
// import '../../css/styles.css';

const {Menu, MenuItem} = remote;

let rightClickPosition = null;

const menu = new Menu();
const menuItem = new MenuItem({
  label: 'Inspect Element',
  click: () => {
    remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
  }
})
menu.append(menuItem)

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  rightClickPosition = {x: e.x, y: e.y}
  menu.popup(remote.getCurrentWindow())
}, false)

window.onload = ()=>{
  ReactDOM.render(<Component />, document.getElementById('app'));

}


