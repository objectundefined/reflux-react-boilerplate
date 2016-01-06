import { default as React } from 'react'
import { default as ReactDOM } from 'react-dom'
import { default as LinkedStateMixin } from 'react-addons-linked-state-mixin'
import { default as Store } from './Store'
import { default as actions } from './actions'


const CommentBox = React.createClass({
  mixins: [Store.mixin('getCurrentState')],
  getInitialState: function() {
    return {comments: []};
  },
  getCurrentState: function() {
    return {comments: Store.getComments()};
  },
  handleCommentSubmit: function(comment) {
    // optimistically add new comment, store update will resolve everything later.
    this.setState({comments: this.state.comments.concat([comment])})
    actions.addComment(comment);    
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <hr/>
        <CommentList comments={this.state.comments.concat([]).reverse()} />
      </div>
    );
  }
});


const Comment = CommentBox.Comment = React.createClass({
    render: function() {
      return (
        <div className="comment panel panel-info">
          <div className="panel-heading commentAuthor">
            {this.props.author}
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
});

const CommentList = CommentBox.CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        {this.props.comments.map((comment) => (
          <Comment key={comment.id} { ...comment }></Comment>
        ))}
      </div>
    );
  }
});

const CommentForm = CommentBox.CommentForm = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {author: Store.getUser().name , text: '', pending: true, id: Date.now()};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onCommentSubmit(this.state);
    this.setState(this.getInitialState());
  },
  isValid: function() {
    return this.state.author.trim() && this.state.text.trim();
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="authorName">Your Name</label>
          <input
            className="form-control"
            id="authorName"
            type="text"
            placeholder="John Doe"
            valueLink={this.linkState('author')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="commentInput">Comment</label>
          <textarea
            className="form-control"
            id="commentInput"
            placeholder="Hello World"
            valueLink={this.linkState('text')}
          />
        </div>
        <button type="submit" disabled={ ! this.isValid() } value="Post" className="btn btn-default">Submit</button>
      </form>
    );
  }
});

export default CommentBox