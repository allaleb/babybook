// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { Link, Redirect } from "react-router-dom";
// import NewPost from "./NewPost.jsx";
// import Post from "./Post.jsx";

// class UnconnectedLikes extends Component {
//   state = {
//     count: 0
//   };

//   incrementMe = () => {
//     let newCount = this.state.count + 1;
//     this.setState({
//       count: newCount
//     });
//   };

//   render = () => {
//     <button onClick={this.incrementMe}>Likes: {this.state.count}</button>;
//   };
// }

// let mapStateToProps = state => {
//   return {
//     count: state.count
//   };
// };

// let Likes = connect(mapStateToProps)(UnconnectedLikes);
// export default Likes;
