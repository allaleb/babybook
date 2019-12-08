import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import NewPost from "./NewPost.jsx";
import Users from "./Users.jsx";
import Milestones from "./Milestones.jsx";

class UnconnectedFirsts extends Component {
  constructor() {
    super();
    this.state = {
      firsts: "",
      file: "",
      date: "",
      firstsUpdate: ""
    };
  }

  firstChangeHandler = event => {
    this.setState({ first: event.target.value });
  };

  fileChangeHandler = event => {
    this.setState({ file: event.target.files[0] });
  };

  dateChangeHandler = event => {
    this.setState({ date: event.target.value });
  };

  fetchMoments = async () => {
    let form = new FormData();
    form.append("username", this.props.username);

    let res = await fetch("/milestones", { method: "POST", body: form });
    let responseBody = await res.text();
    let returnedMoments = JSON.parse(responseBody);
    console.log(returnedMoments, "returnedMoments");
    this.props.dispatch({
      type: "set-moments",
      moments: returnedMoments.moments,
      milestonesId: returnedMoments._id
    });
  };

  submitHandler = async event => {
    console.log("new item submitted");
    event.preventDefault();
    let data = new FormData();
    data.append("firsts", this.state.first);
    data.append("file", this.state.file);
    data.append("date", this.state.date);
    data.append("username", this.props.username);

    let response = await fetch("/firsts", { method: "POST", body: data });
    // response is now a response object
    let body = await response.text();
    // body is now the response body
    let firstsUpdate = JSON.parse(body);
    // profileUpdate now contains whatever json was send back by the server in res.send
    if (firstsUpdate.success === true) {
      window.alert("Your information was received!");
      this.fetchMoments();

      let res = await fetch("/milestones", {username: username},{ method: "POST", body: data });
      let body = await res.text();
      let firstLoad = JSON.parse(body);
      if (firstLoad.success === true) {
        window.alert("Your information was received!");
      }
    }
  };

  render = () => {
    return (
      <div>
        <form className="forms" onSubmit={this.submitHandler}>
          <input
            className="test"
            type="text"
            onChange={this.firstChangeHandler}
            placeholder="My first...."
          ></input>

          <input
            className="test"
            type="date"
            onChange={this.dateChangeHandler}
          ></input>

          <input type="file" onChange={this.fileChangeHandler} />

          <input type="submit" value="Submit"></input>
        </form>
        <Milestones firstsUpdate={this.state.firstsUpdate} />
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    username: state.username
  };
};

let Firsts = connect(mapStateToProps)(UnconnectedFirsts);

export default Firsts;
