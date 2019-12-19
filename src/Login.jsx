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
      friends: body.friends,
      profilePic: body.profilePic
    });
  };

  render = () => {
    if (this.props.loggedIn === false) {
      return (
        <div>
          <div className>
            <div>
              
            </div>
          </div>
          <div className="container">
            <div className="box1">
              <div className="cover">
                <div className="formbox">
                  <h1 className="signup">Log in </h1>
                  <form className="login-form" onSubmit={this.handleSubmit}>
                    
                    <div>
                      <input
                        type="text"
                        className="inputbody in1"
                        placeholder="Username..."
                        onChange={this.handleUsernameChange}
                      />
                    </div>
                   

                    <div>
                      <input
                        type="password"
                        className="inputbody in2"
                        placeholder="Password..."
                        onChange={this.handlePasswordChange}
                      />
                    </div>
                    <div className="signUpButton">
                      <div className="buttonLogin">
                        <input
                          type="submit"
                          className="buttonLogin"
                          value="Login"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <Link className="link" to="/signup">
            <div className="account">Not a member? </div>
            <div className="account">Click here to create an account.</div>
          </Link>

          <div className="loginImg"> </div>
          
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
