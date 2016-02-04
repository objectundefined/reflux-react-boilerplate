import Reflux from 'reflux' 
import * as actions from '../actions'
import StateMixin from 'reflux-state-mixin'

const DEFAULT_USER = {
  email: 'admin@admin.com',
  password: 'password',
  name: 'Admin'
}

export default Reflux.createStore({

  listenables: [ actions.auth ],
  mixins: [StateMixin.store],
  getInitialState() {
      return { user: null };
  },
  logout() {
    this.setState({ user: null })
  },
  login(creds) {
    if(creds.email == DEFAULT_USER.email && creds.password == DEFAULT_USER.password) {
      actions.auth.login.completed(this.state.user);
      this.setState({ user: DEFAULT_USER })
    } else {
      let err = new Error('Bad Login');
      actions.auth.login.failed(err);
    }
  },
  isLoggedIn() {
    return !!this.state.user;
  }
});