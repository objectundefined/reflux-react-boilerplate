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
	// logIn: function(creds) {
	// 	if(creds.email == DEFAULT_USER.email && creds.password == DEFAULT_USER.password) {
	// 		let user = DEFAULT_USER;
	// 		this.user = user;
	// 		actions.auth.logIn.completed(user);
	// 	} else {
	// 		let err = new Error('Bad Login');
	// 		actions.auth.logIn.failed(err);
	// 	}
	// },
	logIn: function(creds, cb) {
		cb = cb || function(){};
	  if(creds.email == DEFAULT_USER.email && creds.password == DEFAULT_USER.password) {
			this.logInCompleted(DEFAULT_USER);
	      cb(null, DEFAULT_USER)
	    } else {
	      cb(new Error('Bad Login'), null);
			this.logInFailed(new Error('Bad Login'))
	    }
	  },
	logInCompleted: function(user){
	    this.user = DEFAULT_USER;
		this.trigger(this.user);
	},
	logInFailed: function(){
		this.trigger(this.user);
	},
  loggedIn: function(){
    return !!this.user;
  },
  getUser: function(){
    return this.user;
  }
});