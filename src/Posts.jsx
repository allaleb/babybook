import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import NewPost from "./NewPost.jsx";
import Post from "./Post.jsx";

class UnconnectedPosts extends Component {
  state = {
    loggedIn: true,
    posts: [],
    filteredPosts: []
  };

  // logoutHandler = async () => {
  //   let logout = await fetch("/logout");
  //   this.props.dispatch({ type: "log-out" });
  // };

  // componentDidMount = () => {
  //   let filteredPosts = async () => {
  //     let response = await fetch("/posts");
  //     let responseBody = await response.text();
  //     console.log("response from posts", responseBody);
  //     let parsed = JSON.parse(responseBody);
  //     console.log("parsed", parsed);
  //     this.props.dispatch({
  //       type: "set-posts",
  //       posts: parsed
  //     });
  //   };
  //   let filteredPosts = posts.filter(post => {
  //     return posts.username === this.props.post._id;
  //   });
  //   this.setState({ filteredPosts: filteredPosts });
  //   setInterval(filteredPosts, 500);
  // };

  render = () => {
    if (this.props.loggedIn) {
      return (
        <div>
          {/* <Link className="link-store" to="/profile">
            Profile
          </Link> */}
          {/* <Link className="link-store" to="/">
            Home
          </Link> */}
          <h1>Welcome to your baby book!</h1>
          <NewPost />
          {this.props.posts.map(post => {
            return <Post key={post._id} post={post} />;
          })}
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  };
}

let mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    posts: state.posts
  };
};

let Posts = connect(mapStateToProps)(UnconnectedPosts);
export default Posts;
