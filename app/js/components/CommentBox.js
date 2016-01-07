import { default as React } from 'react'
import { default as ReactDOM } from 'react-dom'
import { default as LinkedStateMixin } from 'react-addons-linked-state-mixin'
import { default as CommentsStore } from '../stores/CommentsStore'
import { default as AuthStore } from '../stores/AuthStore'
import { comments as commentsActions } from '../actions'
import { default as reflux } from 'reflux'
import { default as _ } from 'lodash'

const CommentBox = React.createClass({
  mixins: [ reflux.connect(CommentsStore, 'comments') ],
  render: function() {
    return (
      <div className="commentBox">
        <CommentForm onCommentSubmit={commentsActions.add} />
        <hr/>
        <CommentList comments={this.state.comments} reverse={true} />
      </div>
    );
  }
});

const Comment = CommentBox.Comment = React.createClass({
    render: function() {
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
});

const CommentList = CommentBox.CommentList = React.createClass({
  getDefaultProps: function(){
    return { comments: [], reverse: false }
  },
  commentsInOrder: function() {
    return this.props.reverse ? this.props.comments.concat([]).reverse() : this.props.comments;
  },
  render: function() {
    return (
      <div className="commentList">
        {this.commentsInOrder().map((comment) => (
          <Comment key={comment.id} { ...comment }></Comment>
        ))}
      </div>
    );
  }
});

const CommentForm = CommentBox.CommentForm = React.createClass({
  mixins: [reflux.connect(AuthStore, 'user'), LinkedStateMixin],
  getInitialState: function() {
    return { text: '', pending: true, id: Date.now()};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onCommentSubmit(this.state);
    this.setState(this.getInitialState());
  },
  isValid: function() {
    return !!this.state.text.trim();
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="authorName">Your Name</label>
          <input
            disabled={true}
            className="form-control"
            id="authorName"
            type="text"
            placeholder="John Doe"
            value={this.state.user.name}
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