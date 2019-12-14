import React, { Component } from "react";
import { connect } from "react-redux";
import Firsts from "./Firsts.jsx";

class UnconnectedMilestones extends Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.fetchMoments;
  }

  fetchMoments = async () => {
    let form = new FormData();
    form.append("username", this.props.username);
    form.append("moment", moment.frontendPath);
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

  deleteMoment = async moment => {
    console.log(this.props, "this.props");
    //we want to create a copy of the moments array to modify. Hint: slice.
    let copy = this.props.moments.slice();
    //we want to filter our copied array so that it doesnr include the deleted moment. HINT: FE path
    copy = copy.filter(m => {
      return m.frontendPath !== moment.frontendPath;
    });

    let data = new FormData();
    console.log("this.props.moment.id", this.props.milestonesid);
    data.append("id", this.props.id);
    data.append("newMoments", JSON.stringify(copy));

    let response = await fetch("/deleteMoment", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    console.log("RESPONSE BODY", body);
    let form = new FormData();
    form.append("username", this.props.username);

    alert("Memory deleted");
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

  //we want to send this entire array as well as the id to the server, you may need to stringnify an array.
  // let data = new FormData();
  // data.append("moment", moment.frontendPath);
  // let response = JSON.parse(body);
  // let responseBody = await response.text();
  // let deleteMoment = JSON.parse(response.body);

  render() {
    return (
      <div className="miles">
        {this.props.moments.map(moment => (
          <div className="milestone-container">
            <div className="firstt">{moment.firsts}</div>
            <div className="firstt">{moment.date}</div>
            <img
              src={moment.frontendPath}
              className="profilePicture"
              height="400px"
            />

            <div>
              <button
                className="memory"
                onClick={() => {
                  this.deleteMoment(moment);
                }}
              >
                <div>Delete this memory </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username,
    moments: state.moments,
    id: state.milestonesId
  };
};

let Milestones = connect(mapStateToProps)(UnconnectedMilestones);
export default Milestones;
