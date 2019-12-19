import React, { Component } from "react";
import { connect } from "react-redux";
import Requests from "./Requests.jsx";
class UnconnectedUsers extends Component {
  state = {
    user: {},
    filteredUser: []
  };

  componentDidMount = async () => {
   
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
      <div className="usersInfo">
        <div className="belongs">
          {"This profile page belongs to " + this.state.user.name}
        </div>
        <img
          src={this.state.user.profilePic}
          className="profilePicture"
          height="300px"
        />
        <div className="me">About me:</div>
       
        <div className="group">
          <div className="interests">
            Interests: {this.state.user.interests}
          </div>

          <div className="interests">I am from {this.state.user.location}</div>

          <div className="interests">{this.state.user.bio}</div>
         
        </div>{" "}
        
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
