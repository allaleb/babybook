import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import NewPost from "./NewPost.jsx";
import Users from "./Users.jsx";
import Milestones from "./Milestones.jsx";

class UnconnectedProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      interests: "",
      location: "",
      file: "",
      username: "",
      bio: ""
    };
  }

  interestsChangeHandler = event => {
    this.setState({ interests: event.target.value });
  };

  locationChangeHandler = event => {
    this.setState({ location: event.target.value });
  };

  nameChangeHandler = event => {
    this.setState({ name: event.target.value });
  };

  fileChangeHandler = event => {
    console.log("test");
    this.setState({ file: event.target.files[0] });
  };

  bioChangeHandler = event => {
    console.log("bio");
    this.setState({ bio: event.target.value });
  };

  submitHandler = async event => {
    console.log("new item submitted");
    event.preventDefault();
    let data = new FormData();
    data.append("name", this.state.name);
    data.append("username", this.props.username);
    data.append("location", this.state.location);
    data.append("interests", this.state.interests);
    data.append("bio", this.state.bio);
    // data.append("useraname", this.props.username);
    data.append("img", this.state.file);
    let response = await fetch("/profile", { method: "POST", body: data });
    // response is now a response object
    let body = await response.text();
    // body is now the response body
    console.log("body", body);
    let profileUpdate = JSON.parse(body);
    // profileUpdate now contains whatever json was send back by the server in res.send
    if (profileUpdate.success === true) {
      window.alert("Your information was received!");
    }
  };

  render = () => {
    return (
      <div>
        <form className="forms" onSubmit={this.submitHandler}>
          <input
            className="test"
            type="text"
            onChange={this.nameChangeHandler}
            placeholder="You full name"
          ></input>
          <div></div>
          <input
            className="test"
            type="text"
            onChange={this.interestsChangeHandler}
            placeholder="Your interests"
          ></input>
          <div></div>
          <input
            className="test"
            type="text"
            onChange={this.locationChangeHandler}
            placeholder="Your location"
          ></input>
          <div></div>
          <input
            className="test"
            type="text"
            onChange={this.bioChangeHandler}
            placeholder="Your bio"
          ></input>
          <div></div>
          <input type="file" onChange={this.fileChangeHandler} />
          <div></div>

          <input type="submit" value="Submit"></input>
        </form>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { username: state.username };
};

let Profile = connect(mapStateToProps)(UnconnectedProfile);

export default Profile;
