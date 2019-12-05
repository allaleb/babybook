import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import NewPost from "./NewPost.jsx";
import Post from "./Post.jsx";

//submit handler
// let filteredPosts = async () => {
//   let response = await fetch("/posts");
//   let responseBody = await response.text();

//   let parsed = JSON.parse(responseBody);

//   this.props.dispatch({
//     type: "set-posts",
//     messages: parsed
//   });
//   return parsed;
// };

class UnconnectedHomepage extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: true,
      posts: [],
      filteredPosts: [],
      username: "",
      password: "",
      signedUp: false,
      bio: ""
      // };
    };
  }

  componentDidMount = () => {
    let filteredPosts = async () => {
      let response = await fetch("/allposts");
      let responseBody = await response.text();

      let parsed = JSON.parse(responseBody);

      this.props.dispatch({
        type: "set-posts",
        posts: parsed
      });
    };
    // let filteredPosts = posts.filter(post => {
    //   return posts.username === this.props.post._id;
    // });
    // this.setState({ filteredPosts: filteredPosts });
    setInterval(filteredPosts, 500);
  };

  usernameHandler = event => {
    this.setState({ username: event.target.value });
  };
  passwordHandler = event => {
    this.setState({ password: event.target.value });
  };

  submitHandler = async event => {
    event.preventDefault();
    let username = this.state.username;
    let password = this.state.password;
    let bio = this.state.bio;
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("bio", bio);
    let response = await fetch("/signup", { method: "POST", body: data });
    let body = await response.text();
    console.log("/signup response", body);
    body = JSON.parse(body);
    if (!body.success) {
      this.props.dispatch({ type: "unsuccessful", loggedIn: false });
      console.log("alert");
      alert("This username is already taken!");
      return;
    }
    this.props.dispatch({ type: "signup-success", loggedIn: true });
    this.setState({ signedUp: true });
  };

  render = () => {
    if (this.props.loggedIn) {
      return <Redirect to="/posts" />;
    } else {
      return (
        <div>
          <div className="container">
            <div className="box">
              <div className="formbox">
                <h1 className="signup bolder">Signup</h1>
                <div className="free bolder">
                  Sign up to see photos and videos from your friends.
                </div>
                <form className="signup-form" onSubmit={this.submitHandler}>
                  <input
                    type="text"
                    className="inputbody in1"
                    value={this.state.username}
                    placeholder="Username..."
                    onChange={this.usernameHandler}
                  ></input>
                  <input
                    type="password"
                    className="inputbody in2"
                    value={this.state.password}
                    placeholder="Password..."
                    onChange={this.passwordHandler}
                  ></input>
                  <input
                    type="submit"
                    className="buttonSignUp"
                    value="Sign up"
                  ></input>
                </form>

                <form className="form">
                  <div className="link-login">
                    <Link className="link" to="/login">
                      <div className="account">Already have an account? </div>
                      <div className="account">Click here to log in.</div>
                    </Link>
                  </div>
                </form>
              </div>
              {/* <Signup /> */}
              <div className="phone">
                <img src="/phone.jpg" />
              </div>
            </div>
          </div>
          //{" "}
        </div>
      );
    }
  };
}

let mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    posts: state.posts

    // add posts
  };
};

let Homepage = connect(mapStateToProps)(UnconnectedHomepage);
export default Homepage;
