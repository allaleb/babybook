import React, { Component } from "react";
import { connect } from "react-redux";
import Users from "./Users.jsx";

class UnconnectedRequests extends Component {
  addFriend = async () => {
    // include both the ids of the profile we are visiting and the person who is making the requests.

    let data = new FormData();
    console.log("userid", this.props.user);
    data.append("from", this.props.username);
    data.append("to", this.props.user);
    let response = await fetch("/requests", { method: "POST", body: data });
    let body = await response.text();
    if (body.success) alert("You have sent a friend request!");
    else alert("Your friend request was sent!");
  };

  ///request component should be inside of the user's profile, and will
  ///it will take a prop of the user whose profile we are visiting
  ///this prop will be the user
  ///users and requests

  //after the userProfile prop is passed to this component from the users component we will use the id inside of the profile, as well as
  ///the user id of the current user to make a fetch request for a friend request

  // ||
  // this.props.friends.includes(this.state.userProfile.friends)

  render() {
    if (this.props.friends.includes(this.props.user)) {
      return <div></div>;
    }
    return (
      <div>
        {this.props.username === this.props.user ? (
          ""
        ) : (
          <button onClick={this.addFriend}>Add Friend</button>
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
