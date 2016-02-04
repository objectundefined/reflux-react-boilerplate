import React, { Component } from 'react' 
import CommentsStore from '../stores/CommentsStore' 
import * as actions from '../actions'
import LinkedStateMixin from 'react-addons-linked-state-mixin' 
import _ from 'lodash' 
import ReactMixin from 'react-mixin'

@ReactMixin.decorate(LinkedStateMixin)
export default class LoginForm extends Component {
  
  static contextTypes = { router: React.PropTypes.object };
  state = { email: '', password: '' , error: null};
  
  isValid() {
    return this.state.email.trim() && this.state.password.trim();
  }
  
  handleSubmit(evt) {
    evt.preventDefault()
    actions.auth.login(this.state)
      .then((user)=>{
        this.context.router.push('/')
      }).catch((err)=>{
        this.setState({error: err})
      })
  }
  
  render(){
    return (
      <form onSubmit={(evt)=>this.handleSubmit(evt)}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input valueLink={this.linkState('email')} type="email" className="form-control" id="exampleInputEmail1" placeholder="Email"/>
        </div>
        <div className={["form-group", (this.state.error ? 'has-error' : '')].join(" ")}>
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" 
            className="form-control" 
            id="exampleInputPassword1"
            placeholder="Password"
            valueLink={this.linkState('password')} 
            onKeyDown={()=>this.state.error = null}
          />
        </div>
        <button type="submit" disabled={!this.isValid()} className="btn btn-default">Submit</button>
      </form>
    )
  }
  
}
