import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Homepage from "./Homepage.jsx";
import Profile from "./Profile.jsx";
import NewPost from "./NewPost.jsx";
import Post from "./Post.jsx";
import Posts from "./Posts.jsx";
import Header from "./Header.jsx";
import Likes from "./Likes.jsx";

class UnconnectedApp extends Component {
  componentDidMount = async () => {
    let res = await fetch("/checkForUser");
    let body = await res.text();
    let loggedIn = JSON.parse(body);
    console.log("parsed body", loggedIn.success);
    if (loggedIn.success) {
      this.props.dispatch({
        type: "login-success",
        username: loggedIn.username
      });
    }
  };

  render = () => {
    return (
      <BrowserRouter>
        <Header />
        <Route exact={true} path="/" component={Homepage} />
        <Route exact={true} path="/signup" component={Signup} />
        <Route exact={true} path="/login" component={Login} />
        <Route exact={true} path="/new-post" component={NewPost} />
        <Route exact={true} path="/posts" component={Posts} />
        <Route
          exact={true}
          path="/posts/:postId"
          render={routerData => (
            <Post postId={routerData.match.params.postId} />
          )}
        />
        <Route
          exact={true}
          path="/profile/"
          render={routerData => (
            <Profile username={routerData.match.params.username} />
          )}
        />
      </BrowserRouter>
    );
  };
}

let App = connect()(UnconnectedApp);
export default App;
