import React, { Component } from "react";
import { connect } from "react-redux";
import Users from "./Users.jsx";
import Requests from "./Requests.jsx";
import Search from "./Search.jsx";
import { Link, Redirect } from "react-router-dom";

class UnconnectedFriends extends Component {
  state = {
    friendRequests: [],
    friends: [],
    user: {},
    filteredUser: []
  };

  componentDidMount = async () => {
    this.reloadFriendReqs();
  };

  acceptRequest = async (from, to) => {
    let data = new FormData();
    console.log("from", from);
    data.append("from", from);
    console.log("to", to);
    data.append("to", to);
    let res = await fetch("/acceptRequest", { method: "POST", body: data });
    let body = await res.text();
    body = JSON.parse(body);
    console.log("body", body);
    if (body.success) {
      alert("friend added");

      this.deleteRequest(from, to);
      return;
    }
    alert("friend was NOT added");
    
  };

  deleteRequest = async (from, to) => {
    console.log(this.props);
    let data = new FormData();
    data.append("from", from);
    data.append("to", to);
    let res = await fetch("/deleteRequest", { method: "POST", body: data });
    let body = await res.text();
    body = JSON.parse(body);
    console.log(body);
    if (body.success) {
      // alert("success");
      this.reloadFriendReqs();
      return;
    }
    alert("request failed!");
  };

  displayFriends = async () => {
    let data = new FormData();
    console.log("username", this.props.username);
    data.append("username", this.props.username);
    let res = await fetch("/displayFriends", { method: "POST", body: data });
    let body = await res.text();
    body = JSON.parse(body);
    console.log("body.friends", body.friends);
    this.setState({ friends: body.friends });
  };

  reloadFriendReqs = async () => {
    let data = new FormData();
    console.log("username", this.props.username);
    data.append("username", this.props.username);
    let response = await fetch("/displayfriendsReq", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    console.log("friend request", body);
    this.setState({ friendRequests: body });
    this.displayFriends();
  };

  render() {
    return (
      <div className="friends-container">
        <Search />
        <div className="friends">
          <div className="friendsList">Your friends' list: </div>

          {this.state.friendRequests.map(friend => (
            <div className="tests">
              <div className="tests1">{friend.from}</div>

              <img
                src={friend.profilePic}
                className="profilePicture"
                height="80px"
              />

              <button
                className="accept"
                onClick={() => this.acceptRequest(friend.from, friend.to)}
              >
                ACCEPT REQUEST
              </button>
              <button
                className="accept"
                onClick={() => this.deleteRequest(friend.from, friend.to)}
              >
                DENY REQUEST
              </button>
            </div>
          ))}

          <div className="tests">
            {this.state.friends.map(friend => (
              <div>
                {" "}
                <Link to={`/users/` + friend.username}>
                  <img
                    src={friend.profilePic}
                    className="profilePicture"
                    height="80px"
                  />
                </Link>
                <div className="userName">{friend.username} </div>
              </div>
            ))}
          </div>
        </div>
        <Requests user={this.props.username} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username,
    userId: state.userId,
    friends: state.friends,
    users: state.users,
    filteredUser: state.filteredUser
  };
};

let Friends = connect(mapStateToProps)(UnconnectedFriends);
export default Friends;
