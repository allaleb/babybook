import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

class UnconnectedHeader extends Component {
  logOutHandler = () => {
    this.props.dispatch({ type: "log-out" });
  };

  render = () => {
    if (!this.props.loggedIn) {
      return (
        <div>
          <div className="nav">
            <div className="baby">Welcome to Baby Book!</div>
            <div></div>
            <Link to="/signup" className="link">
              SIGN UP
            </Link>
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
          <Link to="/logout" className="link" onClick={this.logOutHandler}>
            LOG OUT
          </Link>
          <Link to="/profile" className="link">
            Profile
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

let Header = connect(mapStateToProps)(UnconnectedHeader);
export default Header;
