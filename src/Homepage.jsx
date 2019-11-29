import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import NewPost from "./NewPost.jsx";
import Post from "./Post.jsx";

let filteredPosts = async () => {
  let response = await fetch("/posts");
  let responseBody = await response.text();
  console.log("response from posts", responseBody);
  let parsed = JSON.parse(responseBody);
  console.log("parsed", parsed);
  this.props.dispatch({
    type: "set-posts",
    messages: parsed
  });
  return parsed;
};

class UnconnectedHomepage extends Component {
  state = {
    loggedIn: true,
    posts: [],
    filteredPosts: []
  };

  componentDidMount = () => {
    let filteredPosts = async () => {
      let response = await fetch("/allposts");
      let responseBody = await response.text();
      console.log("response from posts", responseBody);
      let parsed = JSON.parse(responseBody);
      console.log("parsed", parsed);
      this.props.dispatch({
        type: "set-posts",
        posts: parsed
      });
    };
    // let filteredPosts = posts.filter(post => {
    //   return posts.username === this.props.post._id;
    // });
    // this.setState({ filteredPosts: filteredPosts });
    setInterval(filteredPosts, 500);
  };

  render = () => {
    if (this.props.loggedIn) {
      return <Redirect to="/posts" />;
    } else {
      return <div>Hi there!!</div>;
    }
  };
}

let mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    posts: state.posts

    // add posts
  };
};

let Homepage = connect(mapStateToProps)(UnconnectedHomepage);
export default Homepage;
