import { default as reflux } from 'reflux'
import * as actions from '../actions'

const DEFAULT_USER = {
  email: 'gabriel.lipson@gmail.com',
  password: 'password',
  name: 'Gabe Lipson'
}

export default reflux.createStore({
  user:null,
  listenables: [ actions.auth ],
  getInitialState: function() {
      return this.user;
  },
  logIn: function(creds, cb) {
    if(creds.email == DEFAULT_USER.email && creds.password == DEFAULT_USER.password) {
      this.user = DEFAULT_USER
      this.trigger(this.user)
      cb(null, DEFAULT_USER)
    } else {
      cb(new Error('Bad Login'), null);
    }
  },
  loggedIn: function(){
    return !!this.user;
  },
  getUser: function(){
    return this.user;
  }
});