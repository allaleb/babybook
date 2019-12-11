import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Likes from "./Likes.jsx";
import Comments from "./Comments.jsx";
import Friends from "./Friends.jsx";
import Requests from "./Requests.jsx";

class UnconnectedPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {
        friends: []
      }
    };
  }

  componentDidMount = async () => {
    this.getProfile();
  };
  getProfile = async () => {
    let data = new FormData();
    data.append("name", this.props.post.username);
    let response = await fetch("/getProfile", { method: "POST", body: data });
    let body = await response.text();
    let profile = JSON.parse(body);
    console.log(profile);
    this.setState({
      userProfile: profile.user
    });
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

  isThereProfilePic = () => {
    if (this.state.userProfile.profilePic !== undefined) {
      return true;
    }
    return false;
  };

  // addFriend = () => {};

  render = () => {
    console.log("this.state", this.state);
    let dispToggle = true;
    if (this.props.post.frontendPath === undefined) {
      dispToggle = false;
    }
    let showPost =
      this.props.friends.includes(this.state.userProfile.username) ||
      this.props.friends.includes(this.state.userProfile.friends) ||
      this.state.userProfile.username === this.props.username;
    if (showPost) {
      return (
        <div style={{ border: "3px solid black", margin: "10px" }}>
          <button onClick={this.deleteOne}>Delete this post </button>
          <button onClick={this.delete}>Delete all posts </button>
          <input type="text" onChange={this.editPostOnChange} />
          <button onClick={this.editPost}>Edit your post </button>
          <Link to={"/posts"}></Link>
          <div className="post">{this.props.post.description}</div>
          <div className="post">Posted by: {this.props.post.username}</div>
          {this.isThereProfilePic() ? (
            <Link to={"/users/" + this.state.userProfile.username}>
              <img src={this.state.userProfile.profilePic} height="100px" />
            </Link>
          ) : (
            <Link to={"/users/" + this.state.userProfile.username}>
              <img src="/noimage.png" height="100px" />
            </Link>
          )}
          {dispToggle ? (
            <img src={this.props.post.frontendPath} height="400px" />
          ) : (
            ""
          )}
          <Likes post={this.props.post} />
          <Comments post={this.props.post} />
        </div>
      );
    } else
      return (
        <div>
          {" "}
          <Link to={"/users/" + this.state.userProfile.username}>
            {this.state.userProfile.username}
            {this.state.userProfile.profilePic ? (
              <img src={this.state.userProfile.profilePic} height="100px" />
            ) : (
              <img src="/noimage.png" height="100px" />
            )}{" "}
          </Link>
          <Requests user={this.state.userProfile.username} />{" "}
          {/* <button onClick={this.addFriend}>Add Friend</button>{" "} */}
        </div>
      );
  };
}

let mapStateToProps = state => {
  return {
    description: state.description,
    file: state.file,
    username: state.username,
    friends: state.friends
  };
};

let Post = connect(mapStateToProps)(UnconnectedPost);

export default Post;
