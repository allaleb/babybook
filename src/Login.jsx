import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import NewPost from "./NewPost.jsx";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  // this.props.dispatch({
  //   type: "set-posts",
  //   messages: parsed
  // });

  handleUsernameChange = event => {
    console.log("new username", event.target.value);
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    console.log("new password", event.target.value);
    this.setState({ password: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log("login from submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/login", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("responseBody from login", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (!body.success) {
      alert("Login failed! Try again!");
      return;
    }
    this.props.dispatch({
      type: "login-success",
      username: this.state.username,
      friends: body.friends
    });
  };

  render = () => {
    if (this.props.loggedIn === false) {
      return (
        <div>
          <div className>
            <div>
              {/* <Link className="link-store" to="/">
                HOME
              </Link> */}
            </div>
          </div>
          <h1 className="login-name">Login </h1>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <div>Username</div>
            <input type="text" onChange={this.handleUsernameChange} />
            <div></div>
            <div>Password</div>
            <input type="password" onChange={this.handlePasswordChange} />
            <input type="submit" value="Login" />
          </form>
          <Link to="/signup" className="link-login">
            Not a member? Click here to create an account
          </Link>
        </div>
      );
    }
    return <Redirect to="/" />;
  };
}
let mapStateToProps = state => {
  return { loggedIn: state.loggedIn };
};
let Login = connect(mapStateToProps)(UnconnectedLogin);

export default Login;
