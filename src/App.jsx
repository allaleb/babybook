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
import Users from "./Users.jsx";
import Comments from "./Comments.jsx";
import Firsts from "./Firsts.jsx";
import Milestones from "./Milestones.jsx";
import Requests from "./Requests.jsx";
import Friends from "./Friends.jsx";

class UnconnectedApp extends Component {
  componentDidMount = async () => {
    let res = await fetch("/checkForUser");
    let body = await res.text();
    let loggedIn = JSON.parse(body);
    if (loggedIn.success) {
      this.props.dispatch({
        type: "login-success",
        username: loggedIn.username
      });
      let data = new FormData();
      data.append("username", loggedIn.username);
      let res = await fetch("/milestones", { method: "POST", body: data });
      let responseBody = await res.text();
      let moments = JSON.parse(responseBody);

      this.props.dispatch({
        type: "set-moments",
        moments: moments.moments,
        milestonesId: moments._id
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
        <Route exact={true} path="/firsts" component={Firsts} />
        <Route exact={true} path="/milestones" component={Milestones} />
        <Route exact={true} path="/requests" component={Requests} />
        <Route exact={true} path="/friends" component={Friends} />
        <Route
          exact={true}
          path="/users/:username"
          render={routerData => (
            <Users username={routerData.match.params.username} />
          )}
        />

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
