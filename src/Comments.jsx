import React, { Component } from "react";
import { connect } from "react-redux";
import Post from "./Post.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

class UnconnectedComments extends Component {
  state = {
    comment: ""
  };
  commenthangeHandler = event => {
    this.setState({ comment: event.target.value });
  };

  submitHandler = async event => {
    event.preventDefault();
    let newComments = this.props.post.comments.slice();
    newComments.push(this.props.username + ":" + this.state.comment);
    let data = new FormData();
    data.append("newComments", JSON.stringify(newComments));
    data.append("id", this.props.post._id);

    let response = await fetch("/comments", { method: "POST", body: data });
    let body = await response.text();
    let postUpdate = JSON.parse(body);

    if (postUpdate.success === true) {
      // window.alert("Your comment was submitted!");
    }
  };

  render() {
    return (
      <div>
        <div>
          <FontAwesomeIcon icon={faComment} color="white" size="2x" />
          {this.props.post.comments.map(comment => {
            return <div className="comment">{comment}</div>;
          })}
        </div>
        <form className="forms" onSubmit={this.submitHandler}>
          <input
            className="test"
            type="text"
            onChange={this.commenthangeHandler}
            placeholder="Enter your comments here"
          ></input>
          <input type="submit" value="Submit"></input>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    comment: state.comment,
    username: state.username
  };
};

let Comments = connect(mapStateToProps)(UnconnectedComments);
export default Comments;
