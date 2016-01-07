import { default as flux } from 'flux-react'
import { default as actions } from '../actions'

export default flux.createStore({
  comments: [{ author: 'Gabe Lipson', id: Date.now(), text:'Hello world' }],
  actions: [
    actions.addComment
  ],
  addComment: function (c) {
    setTimeout(()=>{
      c.pending = false;
      this.comments.push(c);
      this.emitChange();
    },1000)
  },
  exports: {
    getComments: function () {
      return this.comments;
    }
  }
});