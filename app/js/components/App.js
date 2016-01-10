import React from 'react' 
import { Router, Route, Link, browserHistory } from 'react-router'
import CommentBox from './CommentBox' 
import AuthStore from '../stores/AuthStore' 
import Login from './Login' 

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
