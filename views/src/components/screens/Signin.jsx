import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const SignIn = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = async () => {
    try {
      M.toast({ html: "Please wait...", classes: "red blue darken-4" });
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        M.toast({ html: "Invalid email address!", classes: "red darken-4" });
        return;
      } else if (password.length < 8) {
        M.toast({ html: "Password min 8 character!", classes: "red darken-4" });
        return;
      }
      const base_url = "/api/v1/auth";
      const send = await fetch(`${base_url}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const result = await send.json();
      if (result.status === "Fail") {
        M.toast({
          html: result.message,
          classes: "red darken-4",
        });
      } else {
        localStorage.setItem("jwt", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        dispatch({ type: "USER", payload: result.user });
        M.toast({
          html: "Sign In successfully",
          classes: "green darken-2",
        });
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="valign-wrapper row login-box">
      <div className="col card s10 pull-s1 pull-m3 l4 pull-l4">
        <div className="card-content">
          <span className="card-title">Sign In</span>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="validate"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-field col s12">
              <label htmlFor="password">Password </label>
              <input
                type="password"
                className="validate"
                name="password"
                id="password"
                value={password}
                minLength="8"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Link to="/signup" className="link-auth">
            Don't have an account?
          </Link>
        </div>
        <div className="card-action right-align">
          <button
            className="btn blue darken-2 waves-effect waves-light"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
