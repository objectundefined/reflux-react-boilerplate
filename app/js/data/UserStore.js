import { default as flux } from 'flux-react'
import { default as actions } from '../actions'

const DEFAULT_USER = {
  email: 'gabriel.lipson@gmail.com',
  password: 'password',
  name: 'Gabe Lipson'
}

export default flux.createStore({
  user:null,
  actions: [
    actions.logIn
  ],
  logIn: function(creds, cb) {
    if(creds.email == DEFAULT_USER.email && creds.password == DEFAULT_USER.password) {
      this.user = DEFAULT_USER
      this.emitChange();
      cb(null, DEFAULT_USER)
    } else {
      cb(new Error('Bad Login'), null);
    }
  },
  exports: {
    loggedIn: function(){
      return !!this.user;
    },
    getUser: function(){
      return this.user;
    }
  }
});