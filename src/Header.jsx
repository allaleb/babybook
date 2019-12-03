import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

class UnconnectedHeader extends Component {
  logOutHandler = async () => {
    let data = new FormData();
    let response = await fetch("/logout", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    // console.log("responseBody from logour", responseBody);
    // let body = JSON.parse(responseBody);
    // console.log("parsed body", body);
    this.props.dispatch({ type: "log-out" });
  };

  render = () => {
    if (!this.props.loggedIn) {
      return (
        <div>
          <div className="nav">
            <div className="baby">Welcome to Baby Book!</div>
            <div></div>
            {/* <Link to="/profile" className="baby">
              Welcome to Baby Book!
            </Link> */}
            {"   "}
            <Link to="/login" className="link">
              LOG IN
            </Link>
          </div>
        </div>
      );
    } else
      return (
        <div className="nav">
          <div className="baby">Welcome to Baby Book!</div>
          <Link to="/profile" className="link">
            PROFILE
          </Link>
          <Link to="/milestones" className="link">
            MILESTONES
          </Link>
          <Link to="/" className="link" onClick={this.logOutHandler}>
            LOG OUT
          </Link>
          <div className="link">
            <Link to="/login" className="link">
              BACK
            </Link>
          </div>
        </div>
      );
  };
}
let mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  };
};

let Header = connect(mapStateToProps)(UnconnectedHeader);
export default Header;
