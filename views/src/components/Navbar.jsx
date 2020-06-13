import React, { useContext, Fragment, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
import bgProfile from "../assets/bg-profile.jpg";
import profile from "../assets/avatar.jpg";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    const sidenav = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenav, {});
  }, []);

  const sidenav = () => {
    const elem = document.querySelector(".sidenav");
    const instance = M.Sidenav.getInstance(elem);
    instance.close();
  };

  const renderList = () => {
    if (state) {
      return (
        <Fragment>
          <li>
            <Link to="/profile"> Profile</Link>
          </li>
          <li>
            <Link to="/post"> Create Post</Link>
          </li>
          <li>
            <Link to="/following-post">Following Post</Link>
          </li>
          <li
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            <Link to="/post" className="btn btn-small red darken-4">
              <i className="material-icons right">directions_run</i>
              Logout
            </Link>
          </li>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <li>
            <Link to="/signin"> Sign In</Link>
          </li>
          <li>
            <Link to="/signup"> Sign Up</Link>
          </li>
        </Fragment>
      );
    }
  };
  return (
    <Fragment>
      <section className="navbar-fixed">
        <nav className="blue darken-1">
          <div className="nav-wrapper container">
            <Link to={state ? "/" : "/signin"} className="brand-sosmed">
              SosmedApp
            </Link>
            {state ? (
              <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
            ) : null}
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {renderList()}
            </ul>
          </div>
        </nav>
      </section>
      <ul className="sidenav" id="mobile-demo" onClick={() => sidenav()}>
        <li>
          <div className="user-view">
            <div className="background">
              <img src={bgProfile} alt="Background User" />
            </div>
            <a href="#user">
              <img className="circle" src={profile} alt="profile user" />
            </a>
            <a href="#name">
              <span className="white-text name">
                {state ? state.name.split(" ")[0] : "loading..."}
              </span>
            </a>
            <a href="#email">
              <span className="white-text email">
                {state ? state.email : "Loading..."}
              </span>
            </a>
          </div>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        {renderList()}
      </ul>
    </Fragment>
  );
};

export default Navbar;
