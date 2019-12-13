import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Likes from "./Likes.jsx";
import Comments from "./Comments.jsx";
import Friends from "./Friends.jsx";
import Requests from "./Requests.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";

class UnconnectedPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {
        friends: []
      },
      expanded: false
    };
  }

  componentDidMount = async () => {
    this.getProfile();
  };
  getProfile = async () => {
    let data = new FormData();
    data.append("name", this.props.post.username);
    let response = await fetch("/getProfile", { method: "POST", body: data });
    let body = await response.text();
    let profile = JSON.parse(body);
    console.log(profile);
    this.setState({
      userProfile: profile.user
    });
  };

  expand = () => this.setState({ expanded: !this.state.expanded });

  deleteOne = async () => {
    let data = new FormData();
    data.append("id", this.props.post._id);
    // data.append("description", this.props.state.description);
    fetch("/deleteOne", { method: "POST", body: data });
  };

  delete = async () => {
    let response = await fetch("/delete");
    let responseBody = await response.text();
    let deletePosts = JSON.parse(responseBody);
  };
  editPost = async () => {
    let data = new FormData();
    data.append("id", this.props.post._id);
    data.append("description", this.state.description);
    let response = await fetch("/editPost", { method: "POST", body: data });
    let responseBody = await response.text();
  };
  editPostOnChange = event =>
    this.setState({ description: event.target.value });

  isThereProfilePic = () => {
    if (this.state.userProfile.profilePic !== undefined) {
      return true;
    }
    return false;
  };

  // addFriend = () => {};

  render = () => {
    console.log("this.state", this.state);
    let dispToggle = true;
    if (this.props.post.frontendPath === undefined) {
      dispToggle = false;
    }
    let showPost =
      this.props.friends.includes(this.state.userProfile.username) ||
      this.props.friends.includes(this.state.userProfile.friends) ||
      this.state.userProfile.username === this.props.username;
    if (showPost) {
      let menu = (
        // (<button onClick={this.expand()}>+</button>)
        <div>
          <button onClick={this.expand}>
            {" "}
            <FontAwesomeIcon icon={faAngleDoubleDown} color="grey" size="2x" />
          </button>
          <Comments post={this.props.post} />
          <div className={this.state.expanded + "Show"}>
            <div className="buttons">
              <button onClick={this.deleteOne} className="buttonDeletePost">
                Delete this post{" "}
              </button>

              <button onClick={this.delete} className="buttonDeletePost">
                Delete all posts{" "}
              </button>
            </div>
            <div>
              <input
                type="text"
                className="edit"
                onChange={this.editPostOnChange}
              />
            </div>

            <div>
              <button onClick={this.editPost} className="buttonSignUp">
                Edit your post{" "}
              </button>
            </div>
          </div>
        </div>
      );
      return (
        <div className="entirePost">
          <div style={{ border: "3px solid black", margin: "10px" }}>
            <div className="description"></div>
            {this.isThereProfilePic() ? (
              <Link to={"/users/" + this.state.userProfile.username}>
                <img
                  src={this.state.userProfile.profilePic}
                  className="profilePicture"
                  height="100px"
                />
              </Link>
            ) : (
              <Link to={"/users/" + this.state.userProfile.username}>
                <img
                  src="/noimage.png"
                  className="profilePicture"
                  height="100px"
                />
              </Link>
            )}
            {dispToggle ? (
              <img
                src={this.props.post.frontendPath}
                className="profilePicture"
                height="600px"
              />
            ) : (
              ""
            )}

            <Likes post={this.props.post} />
          </div>
          <div>
            <div className="comments">
              <div className="posts">
                <div className="posts">
                  <div className="by">
                    <div className="byName">
                      <div>Posted by: {this.props.post.username}</div>
                    </div>
                  </div>
                </div>
                <div className="desc">{this.props.post.description}</div>
              </div>

              {menu}
            </div>
            {/* <div>
              <button onClick={this.deleteOne} className="deletePost">
                Delete this post{" "}
              </button>
            </div>
            <div>
              <button onClick={this.delete} className="deletePosts">
                Delete all posts{" "}
              </button>
            </div>
            <div>
              <input
                type="text"
                className="edit"
                onChange={this.editPostOnChange}
              />
            </div>
            <div>
              <button onClick={this.editPost} className="editPost">
                Edit your post{" "}
              </button>
            </div> */}
            <Link to={"/posts"}></Link>
          </div>
        </div>
      );
    } else
      return (
        <div>
          {" "}
          <Link
            className="Link"
            to={"/users/" + this.state.userProfile.username}
          >
            <div className="user"> {this.state.userProfile.username}</div>
            {this.state.userProfile.profilePic ? (
              <img
                src={this.state.userProfile.profilePic}
                className="profilePicture"
                height="100px"
              />
            ) : (
              <img
                src="/noimage.png"
                className="profilePicture"
                height="100px"
              />
            )}{" "}
          </Link>
          <Requests user={this.state.userProfile.username} />{" "}
          {/* <button onClick={this.addFriend}>Add Friend</button>{" "} */}
        </div>
      );
  };
}

let mapStateToProps = state => {
  return {
    description: state.description,
    file: state.file,
    username: state.username,
    friends: state.friends
  };
};

let Post = connect(mapStateToProps)(UnconnectedPost);

export default Post;
