import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

class UnconnectedNewPost extends Component {
  state = {
    file: "",
    description: "",
    username: ""
  };

  descChangeHandler = event =>
    this.setState({ description: event.target.value });

  fileChangeHandler = event => this.setState({ file: event.target.files[0] });

  submitHandler = evt => {
    console.log("calling new post submit handler");

    evt.preventDefault();
    let data = new FormData();
    data.append("file", this.state.file);
    data.append("description", this.state.description);
    data.append("username", this.props.username);
    fetch("/new-post", { method: "POST", body: data });
  };

  render = () => {
    return (
      <form onSubmit={this.submitHandler}>
        <input type="file" onChange={this.fileChangeHandler} />
        <input
          type="text"
          value={this.state.description}
          onChange={this.descChangeHandler}
        />
        <input type="submit" value="create new" />
      </form>
    );
  };
}
let mapStateToProps = state => {
  return {
    username: state.username,
    file: state.file,
    description: state.description
  };
};

let NewPost = connect(mapStateToProps)(UnconnectedNewPost);

export default NewPost;