import React, { useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import "./app.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/screens/Home";
import SignIn from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import SignUp from "./components/screens/Signup";
import Post from "./components/screens/Post";
import userProfile from "./components/screens/userProfile";
import FollowingPosts from "./components/screens/FollowingPosts";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signin" component={SignIn} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/signup" component={SignUp} />
      <Route path="/post" component={Post} />
      <Route path="/profile/:userId" component={userProfile} />
      <Route path="/following-post" component={FollowingPosts} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
