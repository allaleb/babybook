import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

class UnconnectedSignup extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      signedUp: false,
      bio: ""
    };
  }

  // usernameHandler = event => {
  //   this.setState({ username: event.target.value });
  // };
  // passwordHandler = event => {
  //   this.setState({ password: event.target.value });
  // };
  // submitHandler = async event => {
  //   event.preventDefault();
  //   let username = this.state.username;
  //   let password = this.state.password;
  //   let bio = this.state.bio;
  //   let data = new FormData();
  //   data.append("username", username);
  //   data.append("password", password);
  //   data.append("bio", bio);
  //   let response = await fetch("/signup", { method: "POST", body: data });
  //   let body = await response.text();
  //   console.log("/signup response", body);
  //   body = JSON.parse(body);
  //   if (!body.success) {
  //     this.props.dispatch({ type: "unsuccessful", loggedIn: false });
  //     console.log("alert");
  //     alert("This username is already taken!");
  //     return;
  //   }
  //   this.props.dispatch({ type: "signup-success", loggedIn: true });
  //   this.setState({ signedUp: true });
  // };
  render = () => {
    if (this.state.signedUp === false) {
      return (
        <div>
          <div className>
            <div>
              <Link className="link-store" to="/">
                Homepage
              </Link>
            </div>
          </div>
          <div className="box">
            <div className="formbox">
              <h1 className="signup bolder">Signup</h1>
              <div className="free bolder">It's free and always will be</div>
              <form className="signup-form" onSubmit={this.submitHandler}>
                <input
                  type="text"
                  className="inputbody in1"
                  value={this.state.username}
                  placeholder="Username"
                  onChange={this.usernameHandler}
                ></input>
                <input
                  type="password"
                  className="inputbody in2"
                  value={this.state.password}
                  placeholder="Password"
                  onChange={this.passwordHandler}
                ></input>
                <input
                  type="submit"
                  className="buttonSignUp"
                  value="Sign up"
                ></input>{" "}
                */}
              </form>
            </div>
          </div>
          <form className="form">
            <div className="link-login">
              <Link className="link" to="/login">
                <div className="account">Already have an account? </div>
                <div className="account">Click here to log in.</div>
              </Link>
            </div>
          </form>
        </div>
      );
    }
    return <Redirect to="/login" />;
  };
}
let mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  };
};
let Signup = connect(mapStateToProps)(UnconnectedSignup);

export default Signup;
