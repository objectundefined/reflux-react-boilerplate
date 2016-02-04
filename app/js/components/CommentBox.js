import React, { Component } from 'react' 
import ReactDOM from 'react-dom' 
import LinkedStateMixin from 'react-addons-linked-state-mixin' 
import CommentsStore from '../stores/CommentsStore' 
import AuthStore from '../stores/AuthStore' 
import * as actions from '../actions'
import Reflux from 'reflux' 
import _ from 'lodash' 
import {Link} from 'react-router'
import StateMixin from 'reflux-state-mixin'
import ReactMixin from 'react-mixin'


@StateMixin.connector(CommentsStore, 'comments')
export default class CommentBox extends Component {
  
  static defaultProps = { comments: [] };
  
  addComment(c) {
    // add the comment temporarily to state until the store updates
    this.setState({ 
      comments: this.state.comments.concat(c)
    })
    actions.comments.add(c);
  }
  
  render(){
    return (
      <div className="commentBox">
        <Link to={'/'} className="pull-right" onClick={actions.auth.logout}>log out</Link>
        <CommentForm onCommentSubmit={c=>this.addComment(c)} />
        <hr/>
        <CommentList comments={this.state.comments} reverse={true} />
      </div>
    );
  
  }
}

export class CommentList extends Component {
  
  static defaultProps = { comments: [], reverse: false };
  
  commentsInOrder(){
    return this.props.reverse ? this.props.comments.concat([]).reverse() : this.props.comments;
  }
  
  render() {
    return (
      <div className="commentList">
        {this.commentsInOrder().map((comment) => (
          <Comment key={comment.id} { ...comment }></Comment>
        ))}
      </div>
    );
  }
}


export class Comment extends Component {
  
  render() {
    return (
      <div className="comment panel panel-info">
        <div className="panel-heading commentAuthor">
          {this.props.user.name}
          {this.props.pending && (
             <span className="pull-right badge">saving <span className="fa fa-spinner fa-spin"/></span>
          )}
        </div>
        <div className="panel-body">
          <p className="commentText">
            {this.props.text}
          </p>
        </div>
      </div>
    );
  }  
  
}

@StateMixin.connector(AuthStore, 'user')
@ReactMixin.decorate(LinkedStateMixin)
export class CommentForm extends Component {
  
  state = { text: '', pending: true, user: {} };
  
  handleSubmit(e) {
    e.preventDefault();
    // fake id for the comment
    var comment = Object.assign({id: Date.now()}, this.state)
    this.props.onCommentSubmit(comment);
    this.setState({ text: '', pending: true });
  }
  
  isValid() {
    return !!this.state.text.trim();
  }
  
  render() {
    return (
      <form className="commentForm" onSubmit={(e)=>this.handleSubmit(e)}>
        <div className="form-group">
          <label htmlFor="authorName">Your Name</label>
          <input disabled={true} className="form-control" id="authorName" type="text"  value={this.state.user.name} />
        </div>
        <div className="form-group">
          <label htmlFor="commentInput">Comment</label>
          <textarea className="form-control" id="commentInput" placeholder="Hello World" valueLink={this.linkState('text')}/>
        </div>
        <button type="submit" disabled={ ! this.isValid() } value="Post" className="btn btn-default">Submit</button>
      </form>
    );
  }
  
  
}
