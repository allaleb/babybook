import React, { Component } from "react";
import { connect } from "react-redux";
import Users from "./Users.jsx";

class UnconnectedRequests extends Component {
  addFriend = async () => {

    let data = new FormData();
    console.log("userid", this.props.user);
    data.append("from", this.props.username);
    data.append("to", this.props.user);
    let response = await fetch("/requests", { method: "POST", body: data });
    let body = await response.text();
    if (body.success) alert("You have sent a friend request!");
    else alert("Your friend request was sent!");
  };

  

  render() {
    if (this.props.friends.includes(this.props.user)) {
      return <div></div>;
    }
    return (
      <div>
        {this.props.username === this.props.user ? (
          ""
        ) : (
          <button onClick={this.addFriend} className="addFriend">
            Add Friend
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username,
    userId: state.userId,
    friends: state.friends
  };
};

let Requests = connect(mapStateToProps)(UnconnectedRequests);
export default Requests;
