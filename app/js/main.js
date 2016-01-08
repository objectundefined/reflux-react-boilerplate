import { default as React } from 'react'
import { default as ReactDOM } from 'react-dom'
import { default as App } from './components/App'

function bootstrapify(){
  // polyfill so bootstrap temporarily has a global obj
  window.jQuery = require('jquery');
  return require('bootstrap') && window.jQuery.noConflict(true)
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);