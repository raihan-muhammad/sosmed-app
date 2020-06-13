import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const Reset = async () => {
    try {
      M.toast({ html: "Please wait...", classes: "red blue darken-4" });
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        M.toast({ html: "Invalid email address!", classes: "red darken-4" });
        return;
      }
      const base_url = "http://localhost:5500/api/v1/auth";
      const send = await fetch(`${base_url}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const result = await send.json();
      if (result.error) {
        M.toast({
          html: result.error,
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
          <span className="card-title">Reset Password</span>
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
          </div>
        </div>
        <div className="card-action right-align">
          <button
            className="btn blue darken-2 waves-effect waves-light"
            onClick={() => Reset()}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reset;
