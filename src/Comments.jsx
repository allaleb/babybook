import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
class UnconnectedComments extends Component {
  render = () => {
    if (!this.props.loggedIn) {
      return (
        <div className="nav">
          <div className="baby">Welcome to Baby Book!</div>
          <Link to="/signup" className="link">
            SIGN UP
          </Link>
          <div></div>
          <Link to="/login">LOG IN</Link>
        </div>
      );
    } else
      return (
        <div className="nav">
          <div className="baby">Welcome to Baby Book!</div>
          <Link to="/logout" className="link">
            LOGOUT
          </Link>
        </div>
      );
  };
}

let mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  };
};

let Comments = connect(mapStateToProps)(UnconnectedComments);
export default Comments;
