import { default as React } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { default as CommentBox } from './CommentBox'
import { default as Store } from './Store'
import { default as actions } from './actions'


import { default as LinkedStateMixin } from 'react-addons-linked-state-mixin'

const Login = React.createClass({
  mixins: [LinkedStateMixin, Store.mixin('getCurrentState')],
  getInitialState: function(){
    return { email: '', password: '' };
  },
  getCurrentState: function(){
    return Store.loggedIn() ? Store.getUser() : this.getInitialState();
  },
  isValid: function(){
    return this.state.email.trim() && this.state.password.trim();
  },
  handleSubmit: function(evt) {
    evt.preventDefault()
    actions.logIn(this.state, (err, user)=>{
      var foo = this;
      debugger;
      
    })
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input valueLink={this.linkState('email')} type="email" className="form-control" id="exampleInputEmail1" placeholder="Email"/>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input valueLink={this.linkState('password')} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
        </div>
        <button type="submit" disabled={!this.isValid()} className="btn btn-default">Submit</button>
      </form>
    )
  }
})

function requireAuth(nextState, replaceState) {
  if (nextState.location.pathname != '/login' && !Store.loggedIn()){
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  } else if (Store.loggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/comments')    
  }
}

var App = React.createClass({
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path="/" onEnter={requireAuth}>
          <Route path="login" component={Login}/>
          <Route path="comments" component={CommentBox}/>
        </Route>
      </Router>
    )
  }
})

export default App
