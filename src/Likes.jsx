// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { Link, Redirect } from "react-router-dom";
// import NewPost from "./NewPost.jsx";
// import Post from "./Post.jsx";

// // class UnconnectedLikes extends Component {
//   constructor(props) {
//     super(props);
//     this.state={
//       likes=[],
// count=0
//     }
//   }
// componentDidMount = async () => {
//   let data = new FormData();
//   data.append("likes", this.props.post.likes);
//   let response = await fetch("/likes", { method: "POST", body: data });
//   let body = await response.text();
//   let profile = JSON.parse(body);
//   console.log(body);
//   this.setState({
//     ...this.state,
//     userProfile: profile.likes
//   });
// };

// likes = async () => {
//   let response = await fetch("/likes");
//   let responseBody = await response.text();
//   let likedPosts = JSON.parse(responseBody);
// };

// likedPost=()=>{
//   if (this.props.user.likes &&
//     this.props.user.likes.find(like=> like.post_id === this.props.post.post_id))
//     return true;
//     else return false;
//   }

// likePost = () => {
//   this.props.likePost(this.props.post.post_id)
// }
// render()  {
// <button onClick="like"/>
// <Link to="/login"/>
// } }

// let Likes = connect(mapStateToProps)(UnconnectedLikes);
// export default Likes;
