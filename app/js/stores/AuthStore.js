import Reflux from 'reflux' 
import * as actions from '../actions'

const DEFAULT_USER = {
  email: 'admin@admin.com',
  password: 'password',
  name: 'Admin'
}

export default Reflux.createStore({
  user:null,
  listenables: [ actions.auth ],
  getInitialState: function() {
      return this.user;
  },
  logout: function() {
    this.user = null;
    this.trigger(this.user);
    actions.auth.logout.completed(null);
  },
	login: function(creds) {
		if(creds.email == DEFAULT_USER.email && creds.password == DEFAULT_USER.password) {
			let user = DEFAULT_USER;
			this.user = user;
			this.trigger(user)
			actions.auth.login.completed(user);
		} else {
			let err = new Error('Bad Login');
			actions.auth.login.failed(err);
		}
	},
  isLoggedIn: function() {
    return !!this.user;
  }
});