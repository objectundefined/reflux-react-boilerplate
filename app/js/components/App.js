import { default as React } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { default as CommentBox } from './CommentBox'
import { default as AuthStore } from '../stores/AuthStore'
import { default as Login } from './Login'

var App = React.createClass({
  authRequired: function(nextState, replaceState) {
    if (nextState.location.pathname != '/login' && !AuthStore.loggedIn()){
      replaceState({ nextPathname: nextState.location.pathname }, '/login')
    }
  },
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path="/" onEnter={this.authRequired}>
          <Route path="login" component={Login}/>
          <Route path="comments" component={CommentBox}/>
        </Route>
      </Router>
    )
  }
})

export default App
