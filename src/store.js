import { createStore } from "redux";

let initialState = {
  loggedIn: false,
  username: "",
  posts: [],
  userId: "",
  moments: [],
  milestonesId: "",
  friends: [],
  profilePic: ""
};

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return {
      ...state,
      loggedIn: true,
      username: action.username,
      friends: action.friends,
      profilePic: action.profilePic
    };
  }

  if (action.type === "signup-success") {
    return { ...state, loggedIn: true };
  }

  if (action.type === "log-out") {
    return { ...state, loggedIn: false };
  }

  if (action.type === "set-posts") {
    return { ...state, posts: action.posts };
  }

  if (action.type === "set-moments") {
    return {
      ...state,
      moments: action.moments,
      milestonesId: action.milestonesId
    };
  }

  return state;
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
