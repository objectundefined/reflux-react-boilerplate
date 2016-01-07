import { default as reflux } from 'reflux'
import { comments as commentActions } from '../actions'

export default reflux.createStore({
  comments: [{ user: {name: 'Gabe Lipson'}, id: Date.now(), text:'Hello world' }],
  listenables: [ commentActions ],
  getInitialState: function() {
      return this.comments;
  },
  add: function (c) {
    // trigger update with pending data, wait for server to reconcile.
    this.trigger(this.comments.concat([c]))
    setTimeout(()=>{
      c.pending = false;
      this.comments.push(c);
      this.trigger(this.comments)
    },1000)
  },
  getComments: function() {
    return this.comments;
  }
});