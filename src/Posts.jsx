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
         
          <div className="postsPage">
          
            <div className="boxx">
              <img
                src={this.props.profilePic}
                className="profile"
                height="200px"
              />
              <div className="space"></div>
              <NewPost />
              
            </div>

           
            {this.props.posts.map(post => {
              return <Post key={post._id} post={post} />;
            })}
          </div>
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
