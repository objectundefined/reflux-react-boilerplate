import './util/fixtures'
import React from 'react' 
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory, IndexRoute, IndexRedirect } from 'react-router'
import CommentBox from './components/CommentBox' 
import AuthStore from './stores/AuthStore' 
import Login from './components/Login' 

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/">
        <IndexRoute getComponent={loginOrComponent(CommentBox)}/>
        <Route path="*">
            <IndexRedirect to="/"/>
        </Route>
    </Route>
  </Router>,
  document.getElementById('app')
);

function loginOrComponent(Component) {
    return (loc, cb) => {
        cb(null, AuthStore.isLoggedIn() ? Component : Login)
    }
}
