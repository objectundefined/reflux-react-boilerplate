import { default as React } from 'react'
import { default as ReactDOM } from 'react-dom'
import { default as LinkedStateMixin } from 'react-addons-linked-state-mixin'
import { default as Store } from './Store'
import { default as actions } from './actions'

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    this.setState({comments: Store.getComments() });
  },
  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
    this.setState({ comments: Store.getComments() });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.comments;
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    comment.id = Date.now();
    this.setState({comments: comments.concat([comment])})
    // The update evt coming back from the store will override the comment state with what's canonical
    actions.addComment(comment);    
  },
  getInitialState: function() {
    return {comments: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
      <div className="commentBox container">
        <h1>Comments</h1>
        <CommentList comments={this.state.comments} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.comments.map(function(comment) {
      return (
        <Comment key={comment.id} { ...comment }></Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text, pending: true});
    this.setState({author: '', text: ''});
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
            value={this.state.author}
            onChange={this.handleAuthorChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="commentInput">Comment</label>
          <textarea
            className="form-control"
            id="commentInput"
            placeholder="Hello World"
            value={this.state.text}
            onChange={this.handleTextChange}
          />
        </div>
        <button type="submit" value="Post" className="btn btn-default">Submit</button>
      </form>
    );
  }
});

var Comment = React.createClass({
    render: function() {
      return (
        <div className="comment">
          <b className="commentAuthor">
            {this.props.author} &nbsp;
            { (this.props.pending) ? <span className="fa fa-spinner fa-spin"/> : ''}
          </b>
          <p className="commentText">
            {this.props.text}
          </p>
        </div>
      );
    }
});

var App = React.createClass({
  render: function() {
    return <CommentBox />
  }
})

export default App
