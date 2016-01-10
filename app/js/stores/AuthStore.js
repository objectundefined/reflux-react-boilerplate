import Reflux from 'reflux' 
import * as actions from '../actions'

const DEFAULT_USER = {
  email: 'gabriel.lipson@gmail.com',
  password: 'password',
  name: 'Gabe Lipson'
}

export default Reflux.createStore({
  user:null,
  listenables: [ actions.auth ],
  getInitialState: function() {
      return this.user;
  },
	login: function(creds) {
		if(creds.email == DEFAULT_USER.email && creds.password == DEFAULT_USER.password) {
			let user = DEFAULT_USER;
			this.user = user;
			actions.auth.login.completed(user);
		} else {
			let err = new Error('Bad Login');
			actions.auth.login.failed(err);
		}
	},
  loggedIn: function(){
    return !!this.user;
  }
});