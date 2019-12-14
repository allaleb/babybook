import { connect } from "react-redux";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

class UnconnectedSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchResults: []
    };
  }

  handleDelete = event => {
    let query = event.target.value;
    this.setState({ query: "" });
  };

  handleOnInputChange = event => {
    let query = event.target.value;
    this.setState({ query: query });
  };

  handleSubmit = async () => {
    event.preventDefault();
    let data = new FormData();
    data.append("searchTerm", this.state.query);
    fetch("/search", { method: "POST", body: data });
    let response = await fetch("/search", { method: "POST", body: data });
    let searchResults = await response.text();
    searchResults = JSON.parse(searchResults);
    this.setState({ searchResults: searchResults });
  };

  render = () => {
    return (
      <div className="container">
        <label className="search-label" htmlFor="search-input">
          <div className="searchInput">
            <div className="search-bar">
              <input
                type="text"
                name="query"
                value={this.state.query}
                className="information"
                placeholder="Search for friends..."
                onChange={this.handleOnInputChange}
              />
              <div></div>
              <button className="buttonSearch" onClick={this.handleSubmit}>
                SEARCH
              </button>
              <div></div>
              <button className="buttonDelete" onClick={this.handleDelete}>
                DELETE
              </button>
            </div>

            <div></div>

            {this.state.searchResults.map(user => {
              console.log("user", user);
              return (
                <div>
                  <div className="flex-center">
                    <Link to={`/users/${user.username}`}>
                      <div className="userName"> {user.username} </div>
                      <img
                        src={user.profilePic}
                        className="profilePicture11"
                        height="100px"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </label>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    query: state.searchQuery
  };
};

let Search = connect(mapStateToProps)(UnconnectedSearch);
export default Search;
