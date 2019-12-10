import React, { Component } from "react";
import { connect } from "react-redux";
import Requests from "./Requests.jsx";
class UnconnectedUsers extends Component {
  state = {
    user: {},
    filteredUser: []
  };

  componentDidMount = async () => {
    ///this.props.usrrname is hte username
    let data = new FormData();
    data.append("username", this.props.username);
    let response = await fetch("/users", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    console.log("body", body[0]);
    this.setState({ user: body[0] });
  };

  render() {
    return (
      <div>
        <h3>{"This profile page belongs to: " + this.state.user.name}</h3>
        <img src={this.state.user.profilePic} height="300px" />
        <h3>{this.state.user.interests}</h3>
        <h3>{this.state.user.location}</h3>
        <h3>{this.state.user.bio}</h3>
        <Requests user={this.props.username} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
    filteredUser: state.filteredUser
  };
};

let Users = connect(mapStateToProps)(UnconnectedUsers);
export default Users;
