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
      <div className="commentBox container-fluid">
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <hr/>
        <CommentList comments={this.state.comments.concat([]).reverse()} />
      </div>
    );
  }
});

var Comment = React.createClass({
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

var CommentList = React.createClass({
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

var CommentForm = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {author: '', text: '', pending: true, id: Date.now()};
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


var App = React.createClass({
  render: function() {
    return <CommentBox />
  }
})

export default App
