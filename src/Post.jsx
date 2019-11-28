import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

class UnconnectedPost extends Component {
  state = {
    count: 0
  };

  deleteOne = async () => {
    let data = new FormData();
    data.append("id", this.props.post._id);
    // data.append("description", this.props.state.description);
    fetch("/deleteOne", { method: "POST", body: data });
  };

  delete = async () => {
    let response = await fetch("/delete");
    let responseBody = await response.text();
    let deletePosts = JSON.parse(responseBody);
  };
  editPost = async () => {
    let data = new FormData();
    data.append("id", this.props.post._id);
    data.append("description", this.state.description);
    let response = await fetch("/editPost", { method: "POST", body: data });
    let responseBody = await response.text();
  };
  editPostOnChange = event =>
    this.setState({ description: event.target.value });

  incrementMe = () => {
    let newCount = this.state.count + 1;
    this.setState({
      count: newCount
    });
  };

  render = () => {
    let dispToggle = true;
    if (this.props.post.frontendPath === undefined) {
      dispToggle = false;
    }
    return (
      <div>
        <button onClick={this.deleteOne}>Delete this post </button>
        <button onClick={this.delete}>Delete all posts </button>
        <input type="text" onChange={this.editPostOnChange} />
        <button onClick={this.editPost}>Edit your post </button>

        {/* <Likes /> */}
        <Link to={"/posts"}></Link>
        <div>Post: {this.props.post.description}</div>
        <div>Username: {this.props.post.username}</div>
        {/* <div>Full Name: {this.props.users.username}</div> */}
        {dispToggle ? (
          <img src={this.props.post.frontendPath} height="400px" />
        ) : (
          ""
        )}
        <button onClick={this.incrementMe}>
          ❤️ Likes❤️ {this.state.count}
        </button>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    description: state.description,
    file: state.file
  };
};

let Post = connect(mapStateToProps)(UnconnectedPost);

export default Post;
