import React from 'react' 
import Reflux from 'reflux' 
import { Router, Route, Link, browserHistory, IndexRedirect, IndexRoute } from 'react-router'
import CommentBox from './CommentBox' 
import AuthStore from '../stores/AuthStore' 
import Login from './Login' 

export default React.createClass({
	mixins: [Reflux.connect(AuthStore, 'user')],
  authRequired: function(nextState, replaceState) {
    return !this.state.user && replaceState({ nextPathname: nextState.location.pathname }, '/login')
  },
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path="/">
					<IndexRedirect to="comments" />
          <Route path="login" component={Login}/>
          <Route path="comments" component={CommentBox} onEnter={this.authRequired}/>
        </Route>
      </Router>
    )
  }
})