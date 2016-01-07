import { default as React } from 'react'
import { default as ReactDOM } from 'react-dom'
import { default as App } from './components/App'

// polyfill
// window.jQuery = require('jquery');
// require('bootstrap')
// window.jQuery.noConflict()

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);