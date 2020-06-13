import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const SignUp = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    if (url) {
      signUp();
    }
  }, [url]);

  const uploadImage = async () => {
    try {
      M.toast({ html: "processing... please wait", classes: "blue darken-3" });
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "sosmedapp");
      data.append("cloud_name", "sosmedapp");
      const requestImage = await fetch(
        `https://api.cloudinary.com/v1_1/sosmedapp/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const resultImage = await requestImage.json();
      setUrl(resultImage.secure_url);
    } catch (err) {
      console.log(err);
    }
  };

  const signUp = async () => {
    try {
      M.toast({ html: "Please wait...", classes: "red blue darken-4" });
      if (name === "") {
        M.toast({ html: "Name cannot be empty!", classes: "red darken-4" });
        return;
      } else if (
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
      const base_url = "http://localhost:5500/api/v1/auth";
      const send = await fetch(`${base_url}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          photo: url,
          tagline,
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
      } else if (password !== passwordConfirm) {
        M.toast({
          html: "Password not same!",
          classes: "red darken-4",
        });
      } else {
        localStorage.setItem("jwt", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        dispatch({ type: "USER", payload: result.user });
        M.toast({
          html: "Sign up successfully",
          classes: "green darken-2",
        });
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cekImage = () => {
    if (image) {
      uploadImage();
    } else {
      signUp();
    }
  };

  return (
    <div className="valign-wrapper row login-box">
      <div className="col card s10 pull-s1 pull-m3 l4 pull-l4">
        <div className="card-content">
          <span className="card-title">Sign Up</span>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                className="validate"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="file-field input-field col s12">
              <div className="btn btn-small blue-grey darken-2">
                <span>
                  <i className="material-icons left">file_upload</i> Image
                </span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input
                  className="file-path validate"
                  type="text"
                  placeholder="Upload your image (optional)"
                />
              </div>
            </div>
            <div className="input-field col s12">
              <label htmlFor="tagline">
                Tagline (ex: Web Developer, student)
              </label>
              <input
                type="text"
                className="validate"
                name="name"
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>
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
                onChange={(e) => setPassword(e.target.value)}
                minLength="8"
              />
            </div>
            <div className="input-field col s12">
              <label htmlFor="password">Confirm Password</label>
              <input
                type="password"
                className="validate"
                name="password"
                id="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                minLength="8"
              />
            </div>
          </div>
          <Link to="/signin" className="link-auth">
            Already have an account?
          </Link>
        </div>
        <div className="card-action right-align">
          <button
            className="btn blue darken-2 waves-effect waves-light"
            onClick={() => cekImage()}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
