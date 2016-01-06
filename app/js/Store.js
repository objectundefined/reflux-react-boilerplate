import { default as flux } from 'flux-react'
import { default as actions } from './actions'

const DEFAULT_USER = {
  email: 'gabriel.lipson@gmail.com',
  password: 'password',
  name: 'Gabe Lipson'
}

const Store = flux.createStore({
  comments: [{ author: 'Gabe Lipson', id: Date.now(), text:'Hello world' }],
  user:null,
  actions: [
    actions.addComment,
    actions.logIn
  ],
  addComment: function (c) {
    setTimeout(()=>{
      c.pending = false;
      this.comments.push(c);
      this.emitChange();
    },1000)
  },
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
    getComments: function () {
      return this.comments;
    },
    loggedIn: function(){
      return !!this.user;
    },
    getUser: function(){
      return this.user;
    }
  }
});


Store.mixin = function(fetchStateMethodName) {
  return {
    applyCurrentState: function() {
      this.setState(this[fetchStateMethodName]());
    },
    componentWillMount: function () {
      Store.addChangeListener(this.applyCurrentState);
    },
    componentWillUnmount: function () {
      Store.removeChangeListener(this.applyCurrentState);
    },
    componentDidMount: function() {
      this.applyCurrentState();
    }
  }
}

export default Store;