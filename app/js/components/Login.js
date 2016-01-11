import React from 'react' 
import CommentsStore from '../stores/CommentsStore' 
import * as actions from '../actions'
import LinkedStateMixin from 'react-addons-linked-state-mixin' 
import _ from 'lodash' 

export default React.createClass({
  mixins: [LinkedStateMixin],
  contextTypes: { router: React.PropTypes.object },
  getInitialState: _.constant({ email: '', password: '' , error: null}),
  isValid: function(){
    return this.state.email.trim() && this.state.password.trim();
  },
  handleSubmit: function(evt) {
    evt.preventDefault()
		actions.auth.login(this.state).then((user)=>{
			this.context.router.push('/')
		}).catch((err)=>{
      this.setState({error: err})
		})
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
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
})