import { createStore } from "redux";

let initialState = {
  loggedIn: false,
  username: "",
  posts: [],
  userId:""
};

let reducer = (state, action) => {
  console.log(action);
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, username: action.username };
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

  return state;
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
