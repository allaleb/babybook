import React, { Component } from "react";
import { connect } from "react-redux";
import Users from "./Users.jsx";
import Requests from "./Requests.jsx";

class UnconnectedFriends extends Component {
  state = {
    friends: []
  };

  componentDidMount = async () => {
    let data = new FormData();
    console.log("username", this.props.username);
    data.append("username", this.props.username);
    data.append("profilePic", this.props.profilePic);
    let response = await fetch("/displayfriends", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({ friends: body });
    console.log("body", body);
  };

  acceptRequest = async () => {
    
  };

  denyRequest = async () => {
    let data = new FormData();
    let friend = await fetch("/requests");
    let body = await res.text();
    data.append("from", friend.from);
    fetch("/denyRequest", { method: "POST", body: data });
  };

  render() {
    // add a profile pic from a person who sent a request in my div.
    return (
      <div>
        {this.state.friends.map(friend => (
          <div>
            {friend.from}
            <button onClick={this.acceptRequest}>ACCEPT REQUEST</button>
            <button onClick={this.denyRequest}>DENY REQUEST</button>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username,
    userId: state.userId
  };
};

let Friends = connect(mapStateToProps)(UnconnectedFriends);
export default Friends;
