import Reflux from 'reflux' 
import * as actions from '../actions'
import StateMixin from 'reflux-state-mixin'

export default Reflux.createStore({
  
  listenables: [ actions.comments ],
  
  mixins: [StateMixin.store],
  
  getInitialState() {
    return {
      comments: [{ user: {name: 'Somebody Else'}, id: Date.now(), text:'Hello world' }]
    }
  },

  add(c) {
      // make a new inst to emulate some json coming back
      var comment = Object.assign({}, c);
      // trigger update with pending data, wait for server to reconcile.
      setTimeout(()=>{
        // server assigns a real id
        comment.id = Date.now();
        comment.pending = false;
        actions.comments.add.completed(comment)
        this.setState({ comments: this.state.comments.concat(comment) })
      },5000)
  }
});