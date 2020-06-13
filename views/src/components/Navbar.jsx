import React, {
  useContext,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
import bgProfile from "../assets/bg-profile.jpg";

const Navbar = () => {
  const searchModal = useRef(null);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    const sidenav = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenav, {});
    M.Modal.init(searchModal.current);
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
          <li style={{ cursor: "pointer" }}>
            <i data-target="modal1" className="material-icons modal-trigger">
              search
            </i>
          </li>
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

  const fetchUser = async (query) => {
    setSearch(query);
    const req = await fetch(`/api/v1/users/search-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ query }),
    });
    const res = await req.json();
    console.log(res);
    setUserDetails(res.user);
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
            <div id="modal1" className="modal" ref={searchModal}>
              <div className="modal-content black-text">
                <h4>Search Users</h4>

                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search User"
                  value={search}
                  onChange={(e) => fetchUser(e.target.value)}
                />

                <ul className="collection">
                  {userDetails.map((user) => {
                    return (
                      <Link
                        to={
                          user._id !== state._id
                            ? `/profile/${user._id}`
                            : "/profile"
                        }
                        onClick={() => {
                          M.Modal.getInstance(searchModal.current).close();
                          setSearch("");
                        }}
                        className="black-text"
                      >
                        <li className="collection-item" key={user._id}>
                          {user.email}
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  href="#!"
                  className="modal-close waves-effect waves-green btn-flat"
                  onClick={() => setSearch("")}
                >
                  Close
                </button>
              </div>
            </div>
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
              <img
                className="circle"
                src={state ? state.photo : "loading..."}
                alt="profile user"
              />
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
