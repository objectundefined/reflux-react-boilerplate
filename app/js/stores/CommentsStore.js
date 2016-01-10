import Reflux from 'reflux' 
import * as actions from '../actions'

export default Reflux.createStore({
  comments: [{ user: {name: 'Gabe Lipson'}, id: Date.now(), text:'Hello world' }],
  listenables: [ actions.comments ],
  getInitialState: function() {
      return this.comments;
  },
  add: function (c) {
    // set a temp id
    c.id = Date.now();
    // trigger update with pending data, wait for server to reconcile.
    this.comments.push(c)
    this.trigger(this.comments)		
    setTimeout(()=>{
      c.pending = false;
			actions.comments.add.completed(c);
			this.trigger(this.comments)
    },1000)
  }
});