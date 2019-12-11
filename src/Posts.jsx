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

  componentDidMount = async () => {
    let response = await fetch("/allposts");
    let responseBody = await response.text();

    let parsed = JSON.parse(responseBody);
    console.log(parsed);
    this.props.dispatch({
      type: "set-posts",
      posts: parsed
    });
  };
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

          <Link to="/firsts" className="link">
            <h3>A first time for everything</h3>
          </Link>
          <div className="boxx">
            <img
              src={this.props.profilePic}
              className="profile"
              height="200px"
            />
            <div className="space"></div>
            <NewPost />
          </div>

          {/* <h1>A first time for everything</h1> */}

          {/* <NewPost /> */}
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
    posts: state.posts,
    profilePic: state.profilePic
  };
};

let Posts = connect(mapStateToProps)(UnconnectedPosts);
export default Posts;
