import { default as React } from 'react'
import { default as Store } from './Store'
import { default as actions } from './actions'
import { default as LinkedStateMixin } from 'react-addons-linked-state-mixin'

export default React.createClass({
  mixins: [LinkedStateMixin],
  contextTypes: {
    router: React.PropTypes.object
  },
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
      var router = this.context.router;
      var _this = this;
      if (err) {
        alert(err.message)
      } else {
        router.replace('/comments')
      }
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