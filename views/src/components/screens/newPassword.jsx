import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import M from "materialize-css";

const SignIn = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { token } = useParams();
  const signIn = async () => {
    try {
      M.toast({ html: "Please wait...", classes: "red blue darken-4" });
      if (password.length < 8) {
        M.toast({ html: "Password min 8 character!", classes: "red darken-4" });
        return;
      }
      const base_url = "http://localhost:5500/api/v1/auth";
      const send = await fetch(`${base_url}/new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          token,
        }),
      });
      const result = await send.json();
      if (result.error) {
        M.toast({
          html: result.error,
          classes: "red darken-4",
        });
      } else if (password !== passwordConfirm) {
        M.toast({
          html: "Password not same!",
          classes: "red darken-4",
        });
      } else {
        M.toast({
          html: result.message,
          classes: "green darken-2",
        });
        history.push("/signin");
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
              <label htmlFor="password">Password </label>
              <input
                type="password"
                className="validate"
                name="password"
                id="password"
                value={password}
                minLength="8"
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-field col s12">
              <label htmlFor="password">Confirm Password</label>
              <input
                type="password"
                className="validate"
                name="password"
                id="password"
                placeholder="Confirm new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                minLength="8"
              />
            </div>
          </div>
        </div>
        <div className="card-action right-align">
          <button
            className="btn blue darken-2 waves-effect waves-light"
            onClick={() => signIn()}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
