import React from 'react' 
import Reflux from 'reflux' 
import { Router, Route, Link, browserHistory } from 'react-router'
import CommentBox from './CommentBox' 
import AuthStore from '../stores/AuthStore' 
import Login from './Login' 

export default React.createClass({
	mixins: [Reflux.connect(AuthStore, 'user')],
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route
					path="/" 
					onEnter={(nextState, replaceState) => {
				    if ( nextState.location.pathname != '/login' && !this.state.user ){
				      replaceState({ nextPathname: nextState.location.pathname }, '/login')
				    }
				}}>
          <Route path="login" component={Login}/>
          <Route path="comments" component={CommentBox}/>
        </Route>
      </Router>
    )
  }
})