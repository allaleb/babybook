import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedLikes extends Component {
  likePost = async () => {
    if (this.props.post.likes.includes(this.props.username) === false) {
      console.log("LIKE POST", this.props.post._id);

      let data = new FormData();
      data.append("postId", this.props.post._id);
      data.append("username", this.props.username);
      let response = await fetch("/likes", { method: "POST", body: data });
      let body = await response.text();
      console.log("RESPONSE BODY", body);
    } else alert("You have already liked this post!");
  };

  render() {
    let numberOfLikes = this.props.post.likes
      ? this.props.post.likes.length
      : 0;
    return <button onClick={this.likePost}>❤️ Likes ❤️ {numberOfLikes}</button>;
  }
}

const mapStateToProps = state => {
  return {
    username: state.username
  };
};

let Likes = connect(mapStateToProps)(UnconnectedLikes);
export default Likes;
